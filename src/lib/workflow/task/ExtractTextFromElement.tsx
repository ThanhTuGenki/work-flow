import { LucideProps, TextIcon } from 'lucide-react';
import { TaskPramType, TaskType } from '../../../../types/task';
import { WorkflowTask } from '../../../../types/workflow';

export const ExtractTextFromElementTask = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label: 'Extract text from element',
    icon: (props: LucideProps) => (
        <TextIcon className='stroke-rose-400' {...props} />
    ),
    isEntryPoint: false,
    credits: 2,
    inputs: [
        {
            name: "Html",
            type: TaskPramType.STRING,
            required: true,
            variant: "textarea",
        },
        {
            name: "Selector",
            type: TaskPramType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        {name: "Body", type: TaskPramType.STRING},
    ] as const,
} satisfies WorkflowTask;