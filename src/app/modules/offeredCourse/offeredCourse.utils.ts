import { TSchedule } from "./offeredCourse.interface";

const hasTimeConflict = (assignedSchedule: TSchedule[], newSchedule: Partial<TSchedule>, id?: string) => {
    for (const schedule of assignedSchedule) {
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`)
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`)
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`)
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`)
        
        if (newStartTime < existingEndTime && newEndTime > existingStartTime && schedule._id.toString() !== id) {
            return true
        }
    }

    return false
}

export default hasTimeConflict