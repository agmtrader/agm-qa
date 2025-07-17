import { accessAPI } from "../api"
import { RegistrationTasksResponse, PendingTasksResponse, DocumentSubmissionRequest, AllForms, AccountManagementRequests, W8BenSubmissionRequest } from "@/lib/entities/account"

// Account Management
export async function ReadAccountDetailsByAccountID(accountID:string): Promise<any | null> {
    let accounts:any = await accessAPI('/accounts/details', 'POST', {'account_id': accountID})
    return accounts || null
}

export async function GetRegistrationTasksByAccountID(accountId: string): Promise<RegistrationTasksResponse | null> {
    try {
        const response: RegistrationTasksResponse = await accessAPI('/accounts/registration_tasks', 'POST', { 'account_id': accountId });
        return response;
    } catch (error) {
        console.error('Error fetching registration tasks:', error);
        return null;
    }
}

export async function GetForms(forms: string[]): Promise<AllForms> {
    const response: AllForms = await accessAPI('/accounts/forms', 'POST', { 'forms': forms })
    return response
}

export async function GetPendingTasksByAccountID(accountId: string): Promise<PendingTasksResponse | null> {
    try {
        const response: PendingTasksResponse = await accessAPI('/accounts/pending_tasks', 'POST', { 'account_id': accountId });
        return response;
    } catch (error) {
        console.error('Error fetching pending tasks:', error);
        return null;
    }
}

export async function SubmitAccountDocument(accountID: string, documentSubmission: DocumentSubmissionRequest) {
    const accountManagementRequests: AccountManagementRequests = {
        accountManagementRequests: {
            documentSubmission
        }
    }
    console.log('accountManagementRequests:', accountManagementRequests)
    const response = await accessAPI('/accounts/update', 'POST', { 'account_id': accountID, 'account_management_requests': accountManagementRequests })
    return response
}

export async function SubmitAccountW8BenForm(accountID: string, updateW8Ben: W8BenSubmissionRequest) {
    const accountManagementRequests: AccountManagementRequests = {
        accountManagementRequests: {
            updateW8Ben
        }
    }
    console.log('accountManagementRequests:', accountManagementRequests)
    const response = await accessAPI('/accounts/update', 'POST', { 'account_id': accountID, 'account_management_requests': accountManagementRequests })
    return response
}