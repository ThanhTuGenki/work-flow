'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SetStateAction, useEffect, useId, useState } from 'react';
import { ParamProps } from '../../../../../../types/appNode';


function StringParam({ param, value, updateNodeParamValue, disabled }: ParamProps) {
    const id = useId();
    const [internalValue, setInternalValue] = useState(value || '');

    useEffect(() => {
        setInternalValue(value)
    }, [value])

    let Component: any = Input;
    if (param.variant === 'textarea') {
        Component = Textarea;
    }

    return (
        <div className='space-y-1 p-1 w-full'>
            <Label htmlFor={id} className='flex text-sm'>
                {param.name}
                {param.require && <p className='text-red-400 px-2'>*</p>}
            </Label>
            <Component
                className='text-xs'
                id={id} value={internalValue}
                placeholder='Enter value here'
                onChange={(e: { target: { value: SetStateAction<string>; }; }) => setInternalValue(e.target.value)}
                onBlur={(e: { target: { value: string; }; }) => updateNodeParamValue(e.target.value)}
                disabled={disabled}
            />
            {param.helperText && (
                <p className='text-muted-foreground px-2'>
                    {param.helperText}
                </p>
            )}
        </div>
    )
}

export default StringParam