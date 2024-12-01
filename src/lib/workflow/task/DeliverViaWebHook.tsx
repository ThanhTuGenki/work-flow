import { SendIcon } from 'lucide-react';
import { TaskPramType, TaskType } from '../../../../types/task';
import { WorkflowTask } from '../../../../types/workflow';

export const DeliverViaWebHookTask = {
    type: TaskType.DELIVER_VIA_WEBHOOK,
    label: 'Deliver via webhook',
    icon: (props) => (
        <SendIcon className='stroke-blue-400' {...props} />
    ),
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "Target Url",
            type: TaskPramType.STRING,
            required: true,
        },
        {
            name: "Body",
            type: TaskPramType.STRING,
            required: true,
        },
    ] as const,
    outputs: [] as const,
} satisfies WorkflowTask;