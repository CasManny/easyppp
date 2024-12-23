import { cn } from '@/lib/utils'
import { AsteriskIcon } from 'lucide-react'
import React, { ComponentPropsWithRef } from 'react'

const RequiredLabelIcon = ({className, ...props}: ComponentPropsWithRef<typeof AsteriskIcon>) => {
  return (
    <AsteriskIcon {...props} className={cn('text-destructive inline size-3 align-top', className)} />
  )
}

export default RequiredLabelIcon