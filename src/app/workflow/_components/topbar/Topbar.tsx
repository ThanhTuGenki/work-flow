'use client';

import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SaveBtn from './SaveBtn';
import ExecuteBtn from './ExecuteBtn';

interface Props {
    title: string;
    workflowId: string;
    subtitle?: string;
    hideButtons?: boolean
}

export default function Topbar({ title, subtitle, workflowId, hideButtons = false }: Props) {
    const router = useRouter();

    return (
        <div className='flex p-2 border-b-2 border-separate justify-between h-[60px] w-full bg-background sticky top-0 z-10'>
            <div className="flex flex-1 gap-1">
                <TooltipWrapper content='Back'>
                    <>
                        <Button variant={'ghost'} size={'icon'} onClick={() => {
                            router.back()
                        }}>
                            <ChevronLeftIcon size={20} />
                        </Button>
                        <div>
                            <p className="font-bold text-ellipsis truncate">{title}</p>
                            {subtitle && (
                                <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>
                            )}
                        </div>
                        <div className="flex flex-1 gap-1 justify-end">
                            {hideButtons === false && (
                                <>
                                    <ExecuteBtn workflowId={workflowId} />
                                    <SaveBtn workflowId={workflowId} />
                                </>
                            )}
                        </div>
                    </>
                </TooltipWrapper>
            </div>
        </div>
    )
}
