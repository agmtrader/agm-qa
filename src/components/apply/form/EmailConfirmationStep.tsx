'use client'

import React, { useEffect, useState, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { Application } from '@/lib/entities/application'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from '@/hooks/use-toast'
import { sendEmailConfirmationEmail } from '@/utils/tools/email'

interface EmailConfirmationStepProps {
  onNext?: () => void
  onPrevious?: () => void
  emailConfirmed: boolean
  setEmailConfirmed: (confirmed: boolean) => void
}

const EmailConfirmationStep: React.FC<EmailConfirmationStepProps> = ({ onNext, onPrevious, emailConfirmed, setEmailConfirmed }) => {
    
  const { getValues } = useFormContext<Application>()

    // Generate a random 4-digit PIN with digits 1-9 only once per component mount
  const pinRef = useRef<string>(Array.from({ length: 4 }, () => Math.floor(Math.random() * 9) + 1).join(''))
  const pin = pinRef.current


  // Determine the email of the first account holder depending on account type
  const accountType = getValues('customer.type') as 'INDIVIDUAL' | 'JOINT' | 'ORG' | undefined
  let email: string | undefined = getValues('customer.email') as string | undefined

  if (!email) {
    if (accountType === 'INDIVIDUAL') {
      email = getValues('customer.accountHolder.accountHolderDetails.0.email') as string | undefined
    } else if (accountType === 'JOINT') {
      email = getValues('customer.jointHolders.firstHolderDetails.0.email') as string | undefined
    } else if (accountType === 'ORG') {
      email = getValues('customer.organization.associatedEntities.associatedIndividuals.0.email') as string | undefined
    }
  }

  const [enteredPin, setEnteredPin] = useState('')
  const [isSending, setIsSending] = useState(false)

  // Send the confirmation email as soon as the component mounts
  useEffect(() => {
    const sendEmail = async () => {
        if (emailConfirmed) {
            return
        }
        
      if (!email) {
        toast({
          title: 'Missing Email',
          description: 'Please provide an email address for the primary account holder before continuing.',
          variant: 'destructive'
        })
        return
      }

      try {
        setIsSending(true)
        await sendEmailConfirmationEmail({ pin }, email)
        setEmailConfirmed(true)
        toast({
          title: 'Confirmation Email Sent',
          description: 'Please check the recipient inbox and enter the PIN below.',
          variant: 'success'
        })
      } catch (error) {
        toast({
          title: 'Failed to Send Email',
          description: 'We were unable to send the confirmation e-mail. Please try again later.',
          variant: 'destructive'
        })
      } finally {
        setIsSending(false)
      }
    }

    void sendEmail()
    // We purposefully only want to run this effect once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-md">We just sent a confirmation email to:</p>
        <p className="font-medium text-lg text-foreground">{email ?? '—'}</p>
      </div>

      <Input
        type="text"
        placeholder="Enter PIN"
        value={enteredPin}
        onChange={(e) => setEnteredPin(e.target.value)}
        maxLength={6}
        className="mt-4"
        disabled={isSending}
      />

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button
          type="button"
          disabled={enteredPin !== pin}
          onClick={() => {
            if (enteredPin === pin) {
              onNext?.()
            } else {
              toast({
                title: 'Invalid PIN',
                description: 'The PIN you entered does not match. Please try again.',
                variant: 'destructive'
              })
            }
          }}
          className="bg-primary text-background hover:bg-primary/90"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default EmailConfirmationStep
