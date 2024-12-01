'use client';

import TooltipWrapper from '@/components/TooltipWrapper';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SaveBtn from './SaveBtn';
import ExecutionBtn from './ExecutionBtn';
import PublishBtn from './PublishBtn';
import NavigationTabs from './NavigationTabs';
import UnpublishBtn from './UnpublishBtn';

interface Props {
    title: string;
    workflowId: string;
    subtitle?: string;
    hideButtons?: boolean
    isPublished?: boolean
}

export default function Topbar({ title, subtitle, workflowId, hideButtons = false, isPublished = false }: Props) {
    const router = useRouter();

    return (
        <header className='flex p-2 border-b-2 border-separate justify-between h-[60px] w-full bg-background sticky top-0 z-10'>
            <div className="flex flex-1 gap-1">
                <TooltipWrapper content='Back'>
                    <Button variant={'ghost'} size={'icon'} onClick={() => {
                        router.back()
                    }}>
                        <ChevronLeftIcon size={20} />
                    </Button>
                </TooltipWrapper>
                <div>
                    <p className="font-bold text-ellipsis truncate">{title}</p>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground truncate text-ellipsis">{subtitle}</p>
                    )}
                </div>
            </div>
            <NavigationTabs workflowId={workflowId} />
            <div className="flex flex-1 gap-1 justify-end">
                {hideButtons === false && (
                    <>
                        <ExecutionBtn workflowId={workflowId} />
                        {isPublished && (
                            <UnpublishBtn workflowId={workflowId} />
                        )}
                        {!isPublished && (
                            <>
                                <SaveBtn workflowId={workflowId} />
                                <PublishBtn workflowId={workflowId} />
                            </>
                        )}
                    </>
                )}
            </div>
        </header>
    )
}
