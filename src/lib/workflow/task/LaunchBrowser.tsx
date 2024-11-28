import { GlobeIcon, LucideProps } from 'lucide-react';
import { TaskPramType, TaskType } from '../../../../types/task';
import { WorkflowTask } from '../../../../types/workflow';

export const LaunchBrowserTask = {
    type: TaskType.LAUNCH_BROWSER,
    label: 'launch browser',
    icon: (props: LucideProps) => (
        <GlobeIcon className='stroke-pink-400' {...props} />
    ),
    isEntryPoint: true,
    credits: 5,
    inputs: [
        {
            name: "Website Url",
            type: TaskPramType.STRING,
            helperText: "eg: https://google.com",
            required: true,
            hideHandle: true,
        },
    ] as const,
    outputs: [
        {name: "Web page", type: TaskPramType.BROWSER_INSTANCE},
    ] as const,
} satisfies WorkflowTask;