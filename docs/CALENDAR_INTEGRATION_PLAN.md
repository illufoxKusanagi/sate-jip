# Calendar Integration Plan

## Overview
Integrating activity calendar with MySQL database using Drizzle ORM. Events are categorized by OPD (Organisasi Perangkat Daerah) instead of users.

---

## Database Schema

### Table: `activity_calendar`
```sql
- id: VARCHAR(50) PRIMARY KEY
- title: VARCHAR(255) NOT NULL
- opdName: VARCHAR(100) NOT NULL  -- References OPD from answer_config
- description: VARCHAR(255)
- startDate: TIMESTAMP NOT NULL
- endDate: TIMESTAMP NOT NULL
- color: VARCHAR(20) DEFAULT '#3b82f6'
- createdAt: TIMESTAMP DEFAULT NOW()
- updatedAt: TIMESTAMP ON UPDATE NOW()
```

---

## Phase 1: Database Setup ✅ COMPLETE

**Status:** Done
- Schema created in `src/lib/db/schema.ts`
- Migration executed
- Table `activity_calendar` exists in database

---

## Phase 2: API Routes ✅ COMPLETE

### File: `src/app/api/event/route.ts`

**GET Endpoint** - Fetch all events
- Query: `SELECT * FROM activity_calendar`
- Transform: Database format → Calendar format
- Response: Array of IEvent objects

**POST Endpoint** - Create new event
- Validate: Zod schema validation
- Transform: Calendar format → Database format
- Insert: New event into database
- Response: Success message

### File: `src/app/api/event/[id]/route.ts`

**PUT Endpoint** - Update event
- Validate: Event exists (404 if not)
- Validate: Request body with Zod
- Update: Only provided fields
- Response: Success message

**DELETE Endpoint** - Delete event
- Validate: Event exists (404 if not)
- Delete: Remove from database
- Response: Success message

**Data Transformation Rules:**
```typescript
// Calendar → Database
{
  title: string,
  opdName: string,        // Direct mapping
  description: string,
  startDate: string,      // ISO string → Convert to Date
  endDate: string,        // ISO string → Convert to Date
  color: string
}

// Database → Calendar
{
  id: number,             // Convert string to number
  opdName: string,        // Direct mapping
  title: string,
  description: string,
  startDate: string,      // timestamp.toISOString()
  endDate: string,        // timestamp.toISOString()
  color: string
}
```

---

## Phase 3: Replace Mock Data ✅ COMPLETE

### File: `src/modules/components/calendar/requests.ts`

**Before:**
```typescript
export const getEvents = async () => {
  return CALENDAR_ITEMS_MOCK;
};
```

**After:**
```typescript
export const getEvents = async () => {
  const response = await fetch('/api/event');
  if (!response.ok) throw new Error('Failed to fetch events');
  return response.json();
};
```

**Removed:**
- `CALENDAR_ITEMS_MOCK` import
- `USERS_MOCK` usage
- All mock data generation

---

## Phase 4: Connect Dialogs to API 🔄 IN PROGRESS

### File: `src/modules/components/calendar/dialogs/add-edit-event-dialog.tsx`

**Current Issues:**
1. ❌ `opdName` field not in form schema
2. ❌ No API call in `onSubmit`
3. ❌ Using hardcoded mock user data
4. ❌ Only updates local state

**Required Changes:**

1. **Update Schema** (`src/modules/components/calendar/schemas.ts`):
```typescript
export const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  opdName: z.string().min(1, "OPD Name is required"),  // ADD THIS
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  color: z.enum(["blue", "green", "red", "yellow", "purple", "orange"]),
});
```

2. **Update Form Default Values**:
```typescript
defaultValues: {
  title: event?.title ?? "",
  opdName: event?.opdName ?? "",      // ADD THIS
  description: event?.description ?? "",
  startDate: initialDates.startDate,
  endDate: initialDates.endDate,
  color: event?.color ?? "blue",
}
```

3. **Add OPD Input Field to Form**:
- Add input field in form UI
- For now: simple text input
- Future: dropdown from database

4. **Update `onSubmit` Function**:
```typescript
const onSubmit = async (values: TEventFormData) => {
  try {
    const payload = {
      title: values.title,
      opdName: values.opdName,
      description: values.description || "",
      startDate: format(values.startDate, "yyyy-MM-dd'T'HH:mm:ss"),
      endDate: format(values.endDate, "yyyy-MM-dd'T'HH:mm:ss"),
      color: values.color,
    };

    if (isEditing) {
      // PUT request
      const response = await fetch(`/api/event/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to update event');
      
      updateEvent({ ...event, ...payload });
      toast.success("Event updated successfully");
    } else {
      // POST request
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) throw new Error('Failed to create event');
      
      const newEvent = await response.json();
      addEvent(newEvent);
      toast.success("Event created successfully");
    }

    onClose();
    form.reset();
  } catch (error) {
    toast.error(error.message);
  }
};
```

### File: `src/modules/components/calendar/dialogs/delete-event-dialog.tsx`

**Current Issues:**
1. ❌ Commented out API call
2. ❌ Only removes from local state

**Required Changes:**
```typescript
const deleteEvent = async () => {
  try {
    const response = await fetch(`/api/event/${eventId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete event');
    
    removeEvent(eventId);
    toast.success("Event deleted successfully");
  } catch (error) {
    toast.error("Error deleting event");
  }
};
```

### File: `src/modules/components/calendar/dialogs/dnd-confirmation-dialog.tsx`

**Purpose:** Update event date when drag-dropped

**Required Changes:**
- Add API call to PUT endpoint when user confirms
- Update both database and local state
- Handle errors gracefully

---

## Phase 5: OPD Integration 🔜 NEXT

### Goals:
1. Fetch OPD list from `answer_config` table
2. Filter: `dataType = 'OPD'`
3. Display in event form dropdown
4. Add OPD filter to calendar header
5. Filter events by selected OPD

### Implementation Steps:

**1. Create OPD Fetcher**
```typescript
// src/modules/components/calendar/requests.ts
export const getOPDs = async () => {
  const response = await fetch('/api/configs?dataType=OPD');
  if (!response.ok) throw new Error('Failed to fetch OPDs');
  const data = await response.json();
  return data.map(item => item.dataConfig.name);
};
```

**2. Update Add/Edit Dialog**
- Add OPD Select dropdown
- Fetch OPDs on component mount
- Populate dropdown with OPD names

**3. Add OPD Filter to Header**
- Modify `src/modules/components/calendar/header/filter.tsx`
- Add OPD dropdown
- Filter events by `opdName` field

**4. Update Calendar Context**
- Replace `selectedUserId` with `selectedOPD`
- Update filter logic to use `opdName`

---

## Phase 6: Testing Checklist ⏳ PENDING

### API Testing
- [ ] GET /api/event returns all events
- [ ] POST /api/event creates new event
- [ ] PUT /api/event/[id] updates event
- [ ] DELETE /api/event/[id] removes event
- [ ] Error handling works (404, 400, 500)

### UI Testing
- [ ] Calendar displays events from database
- [ ] Add Event dialog creates event
- [ ] Edit Event dialog updates event
- [ ] Delete Event dialog removes event
- [ ] Drag-drop updates event date
- [ ] OPD filter works
- [ ] Events persist after page refresh

### Edge Cases
- [ ] Empty event list
- [ ] Network errors
- [ ] Invalid date ranges
- [ ] Missing required fields
- [ ] Concurrent updates

---

## Data Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ getEvents()
       ↓
┌─────────────────────┐
│  requests.ts        │
│  fetch('/api/event')│
└──────┬──────────────┘
       │ HTTP GET
       ↓
┌─────────────────────┐
│  API Route          │
│  /api/event/route.ts│
└──────┬──────────────┘
       │ db.select()
       ↓
┌─────────────────────┐
│  MySQL Database     │
│  activity_calendar  │
└──────┬──────────────┘
       │ rows
       ↑
       │ Transform data
┌──────┴──────────────┐
│  IEvent[] format    │
│  { opdName: string }│
└──────┬──────────────┘
       │ return JSON
       ↓
┌─────────────────────┐
│  Calendar UI        │
│  Displays events    │
└─────────────────────┘
```

---

## Future Enhancements

### Short Term
- Add event categories/tags
- Recurring events support
- Event notifications
- Export to iCal format

### Long Term
- Multi-user permissions
- Event approval workflow
- Integration with other systems
- Analytics dashboard

---

## Notes & Considerations

### OPD vs User
- **Current:** Using `opdName` as simple string
- **Future:** Reference to `answer_config.id` (Foreign Key)
- **Migration Path:** Add FK constraint later, populate existing data

### Timezone Handling
- Database: UTC timestamps
- Display: User's local timezone
- Conversion: Handle in frontend

### Performance
- Index on `opdName` column
- Index on `startDate`, `endDate`
- Consider pagination for large datasets

### Security
- Add authentication checks
- Validate OPD exists before saving
- Prevent SQL injection (using Drizzle ORM)

---

## Status Legend
✅ Complete
🔄 In Progress
⏳ Pending
❌ Blocked
