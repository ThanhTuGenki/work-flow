'use client';

import React from 'react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { TaskType } from '../../../../types/task';
import { TaskRegistry } from '@/lib/workflow/task/registry';
import { Button } from '@/components/ui/button';

function TaskMenu() {
    return (
        <aside className='w-[340px] min-w-[340px] max-w-[340px] border-r-2 border-separate h-full p-2 px-4 overflow-auto'>
            <Accordion type={'multiple'} className='w-full'>
                <AccordionItem value='extraction' defaultValue={['extraction']}>
                    <AccordionTrigger className='font-bold'>
                        Data extraction
                    </AccordionTrigger>
                    <AccordionContent className='flex flex-col gap-1'>
                        <TaskMenuBtn taskType={TaskType.PAGE_TO_HTML} />
                        <TaskMenuBtn taskType={TaskType.EXTRACT_TEXT_FROM_ELEMENT} />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </aside>
    )
}

function TaskMenuBtn({ taskType }: { taskType: TaskType }) {
    const task = TaskRegistry[taskType];

    const onDragStart = (e: React.DragEvent, type: TaskType) => {
        e.dataTransfer.setData('application/reactflow', type);
        e.dataTransfer.effectAllowed = 'move';
    }

    return (
        <Button
            variant={'secondary'}
            className='flex items-center justify-between gap-2 w-full border'
            draggable
            onDragStart={(e) => onDragStart(e, taskType)}
        >
            <div className="flex items-center gap-2">
                <task.icon size={20} />
                {task.label}
            </div>
        </Button>
    )
}

export default TaskMenu