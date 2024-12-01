import { TaskPramType } from "../../../../../types/task";

export const ColorForHandle: Record<TaskPramType, string> = {
    [TaskPramType.BROWSER_INSTANCE]: '!bg-sky-400',
    [TaskPramType.STRING]: '!bg-amber-400',
    [TaskPramType.SELECT]: '!bg-rose-400',
}