'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
} from '@/components/ui/form'
import { application_schema } from '@/lib/entities/schemas/application'
import { Application, InternalApplication } from '@/lib/entities/application';
import { useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import AccountHolderInfoStep from './AccountHolderInfoStep'
import { CreateApplication, SendApplicationToIBKR } from '@/utils/entities/application'
import { GetForms } from '@/utils/entities/account'
import { AllForms, FormDetails } from '@/lib/entities/account'
import DocumentsStep from './DocumentsStep'
import AccountTypeStep from './AccountTypeStep'
import { Button } from '@/components/ui/button'
import LoaderButton from '@/components/misc/LoaderButton'
import { formatTimestamp } from '@/utils/dates'
import { Check } from "lucide-react"
import ApplicationSuccess from './ApplicationSuccess'
import { getApplicationDefaults } from '@/utils/form'
import { useTranslationProvider } from '@/utils/providers/TranslationProvider'
import { individual_form } from '@/lib/sample_info'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LoadingComponent from '@/components/misc/LoadingComponent'
import { Input } from '@/components/ui/input'

enum FormStep {
  ACCOUNT_TYPE = 0,
  ACCOUNT_HOLDER_INFO = 1,
  FORMS = 2,
  DOCUMENTS = 3,
  SUMMARY = 4,
  SUCCESS = 5
}

const IBKRApplicationForm = () => {

  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.ACCOUNT_TYPE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sentApplication, setSentApplication] = useState<Application | null>(null);
  const [sentApplicationResponse, setSentApplicationResponse] = useState<any | null>(null);
  const [fetchedForms, setFetchedForms] = useState<FormDetails[] | null>(null);

  const [userSignature, setUserSignature] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const { t } = useTranslationProvider();

  useEffect(() => {
    const fetchForms = async () => {
      const forms = await GetForms(['3230', '3024', '4070', '3044', '3089', '4304', '4404', '5013', '5001', '4024', '9130', '3074', '3203', '3070', '3094', '3071', '4587', '2192', '2191', '3077', '4399', '4684', '2109', '4016', '4289']);
      setFetchedForms(forms.formDetails);
    }
    fetchForms();
  }, []);

  const form = useForm<Application>({
    resolver: zodResolver(application_schema),
    defaultValues: getApplicationDefaults(application_schema),
    mode: 'onChange',
    shouldUnregister: false,
  });

  // Helper to validate the required fields for the current step before moving on
  const validateCurrentStep = async () => {
    // Account Type step: make sure an account type is selected
    if (currentStep === FormStep.ACCOUNT_TYPE) {
      return await form.trigger('customer.type');
    }

    // Account Holder Information step: validate the full form (all currently registered fields)
    if (currentStep === FormStep.ACCOUNT_HOLDER_INFO) {
      return await form.trigger();
    }

    if (currentStep === FormStep.FORMS) {
      return userSignature !== null;
    }

    // No extra validation required for other steps here
    return true;
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();

    if (isValid) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: 'Form Errors',
        description: 'Please correct the highlighted errors before continuing.',
        variant: 'destructive'
      });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  async function onSubmit(values: Application) {
    try {
      if (currentStep !== FormStep.DOCUMENTS) {
        setCurrentStep(currentStep + 1);
        return;
      }
      
      setIsSubmitting(true);

      const advisor_id = searchParams.get('ad') || null;
      const master_account_id = searchParams.get('ma') || null;
      const lead_id = searchParams.get('ld') || null;

      // Sanitize documents: remove holderId from each document
      const sanitizedDocuments = (values.documents || []).map((doc: any) => {
        const { holderId, ...rest } = doc;
        return rest;
      });
      const sanitizedValues = { ...values, documents: sanitizedDocuments };

      const internalApplication: InternalApplication = {
        application: sanitizedValues,
        advisor_id,
        master_account_id,
        lead_id,
        id: "",
        created: formatTimestamp(new Date()),
        updated: formatTimestamp(new Date()),
        date_sent_to_ibkr: null,
        user_id: null,
      }

      console.log('Application ready to submit:', internalApplication.application);

      setSentApplication(internalApplication.application);

      const sendResponse = await SendApplicationToIBKR(internalApplication.application);
      if (!sendResponse) {
        throw new Error('Failed to send application to IBKR');
      }

      setSentApplicationResponse(sendResponse);
      
      toast({
        title: "Application Submitted",
        description: "Your IBKR application has been successfully submitted.",
        variant: "success"
      });

      // Move to summary step to review JSONs
      setCurrentStep(FormStep.SUMMARY);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const renderProgress = () => {
    const steps = [
      { name: t('apply.account.header.steps.account_type'), step: FormStep.ACCOUNT_TYPE },
      { name: t('apply.account.header.steps.account_holder_info'), step: FormStep.ACCOUNT_HOLDER_INFO },
      { name: t('apply.account.header.steps.forms'), step: FormStep.FORMS },
      { name: t('apply.account.header.steps.documents'), step: FormStep.DOCUMENTS },
      { name: t('apply.account.header.steps.summary') ?? 'Review', step: FormStep.SUMMARY },
      { name: t('apply.account.header.steps.complete'), step: FormStep.SUCCESS }
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.step ? 'bg-primary text-background' : 'bg-muted text-foreground'}`}>
                  {currentStep >= step.step ? (
                    step.step === FormStep.SUCCESS ? <Check className="w-4 h-4" /> : index + 1
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="mt-2 text-sm">{step.name}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 bg-muted">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: currentStep > step.step ? '100%' : '0%', transition: 'width 0.3s ease-in-out' }}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === FormStep.SUCCESS) {
    return <ApplicationSuccess />;
  }

  return (
    <div className="flex flex-col justify-center items-center my-20 gap-5 p-5">
      <div className="text-center">
        <h1 className="text-3xl font-bold ">{t('apply.account.header.title')}</h1>
        <p className="text-lg">{t('apply.account.header.description')}</p>
      </div>
      {renderProgress()}
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] max-w-3xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {currentStep === FormStep.ACCOUNT_TYPE && (
              <>
                <AccountTypeStep form={form} />
                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {currentStep === FormStep.ACCOUNT_HOLDER_INFO && (
              <>
                <AccountHolderInfoStep form={form} />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {currentStep === FormStep.DOCUMENTS && (
              <>
                <DocumentsStep form={form} />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <LoaderButton onClick={form.handleSubmit(onSubmit)} isLoading={isSubmitting} text="Submit Application"/>
                </div>
              </>
            )}
            {currentStep === FormStep.FORMS && (
              <>
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold mb-2">Agreements and Disclosures</h2>
                    {fetchedForms ? fetchedForms.map((form) => (
                      <Card key={form.formNumber} className="p-4">
                        <CardContent>
                          {form.formName}
                          <p>{form.formNumber}</p>
                        </CardContent>
                      </Card>
                    )) : (
                      <LoadingComponent />
                    )}
                </div>
                <div className="flex gap-2">
                  <p className="text-sm">Please enter your signature to continue</p>
                  {userSignature === null && <p className="text-sm text-primary">Required</p>}
                </div>
                <Input
                  type="text"
                  placeholder=""
                  value={userSignature || ""}
                  onChange={(e) => setUserSignature(e.target.value)}
                />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleNextStep}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
            {currentStep === FormStep.SUMMARY && (
              <>
                <div className="space-y-8">
                  <h1>This page is just for IBKR debugging and compliance purposes, will not be shown to the user.</h1>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Application Sent</h2>
                    <pre className="bg-muted p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(sentApplication, null, 2)}
                    </pre>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2">IBKR Response</h2>
                    <pre className="bg-muted p-4 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(sentApplicationResponse, null, 2)}
                    </pre>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setCurrentStep(FormStep.SUCCESS)}
                    className="bg-primary text-background hover:bg-primary/90"
                  >
                    Complete
                  </Button>
                </div>
              </>
            )}
          </form>
        </Form>
      </div>
    </div>
  );

}

export default IBKRApplicationForm;