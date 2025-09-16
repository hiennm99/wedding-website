// databaseService.ts - Supabase version with better error handling and no any types

import { createClient, SupabaseClient, PostgrestError, AuthError } from '@supabase/supabase-js';

// Types - Updated to match your database schema
interface AttendeeData {
    attendee: string;
    joinable: boolean;  // Changed from string to boolean
    has_relative: boolean;  // Changed from string to boolean
    transport: string;
    message: string;
}

interface ServiceResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: Error | PostgrestError | AuthError | unknown;
}

// Database schema type - Updated to match your actual schema
type Database = {
    public: {
        Tables: {
            attendees: {
                Row: AttendeeData & {
                    id?: number;
                    created_at?: string;
                };
                Insert: AttendeeData;
                Update: Partial<AttendeeData>;
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
        CompositeTypes: {
            [_ in never]: never;
        };
    };
};

class DatabaseService {
    private supabase: SupabaseClient | null = null;
    private isConfigured = false;

    constructor() {
        try {
            // Get environment variables
            const supabaseUrl = 'https://agcgbihujvgkemhglthq.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnY2diaWh1anZna2VtaGdsdGhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NzEwNzUsImV4cCI6MjA3MjU0NzA3NX0.5Cx-VOZIcnhdA800THsBPh2DdMzgXlKqsWNiijKz1GQ';

            console.log('Supabase URL:', supabaseUrl ? 'Found' : 'Missing');
            console.log('Supabase Key:', supabaseKey ? 'Found' : 'Missing');

            if (!supabaseUrl || !supabaseKey) {
                console.error('❌ Missing Supabase environment variables');
                console.log('Make sure you have:');
                console.log('- NEXT_PUBLIC_SUPABASE_URL or VITE_SUPABASE_URL');
                console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY or VITE_SUPABASE_ANON_KEY');
                this.isConfigured = false;
                return;
            }

            this.supabase = createClient(supabaseUrl, supabaseKey, {
                auth: {
                    persistSession: false // Don't persist auth for simple insert
                }
            });
            this.isConfigured = true;
            console.log('✅ Supabase configured successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Supabase:', error);
            this.isConfigured = false;
        }
    }

    // Insert data vào Supabase
    async insertData(data: AttendeeData | AttendeeData[]): Promise<ServiceResponse<AttendeeData[]>> {
        if (!this.isConfigured || !this.supabase) {
            return {
                success: false,
                message: 'Supabase chưa được cấu hình đúng. Kiểm tra environment variables.',
                error: new Error('Configuration error')
            };
        }

        try {
            const dataArray = Array.isArray(data) ? data : [data];

            console.log('🚀 Inserting data to Supabase:', dataArray);

            // Test connection first
            const { error: testError } = await this.supabase
                .from('attendees')
                .select('*')
                .limit(1);

            if (testError) {
                console.error('❌ Connection test failed:', testError);
                return {
                    success: false,
                    message: 'Không thể kết nối database. Kiểm tra cấu hình Supabase.',
                    error: testError
                };
            }

            // Insert data
            const { data: result, error } = await this.supabase
                .from('attendees')
                .insert(dataArray)
                .select();

            if (error) {
                console.error('❌ Supabase insert error:', error);

                // Handle specific errors
                if ('code' in error && error.code === 'PGRST116') {
                    return {
                        success: false,
                        message: 'Table "attendees" không tồn tại. Vui lòng tạo table trong Supabase.',
                        error: error
                    };
                }

                if ('code' in error && error.code === '42501') {
                    return {
                        success: false,
                        message: 'Không có quyền insert. Kiểm tra RLS policies trong Supabase.',
                        error: error
                    };
                }

                const errorMessage = 'message' in error ? error.message : 'Unknown error';
                return {
                    success: false,
                    message: 'Lỗi database: ' + errorMessage,
                    error: error
                };
            }

            console.log('✅ Supabase insert success:', result);
            return {
                success: true,
                message: `Đã xác nhận tham dự thành công! 🎉`,
                data: result as AttendeeData[]
            };

        } catch (error: unknown) {
            console.error('❌ Insert data error:', error);

            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            const errorName = error instanceof Error ? error.name : 'UnknownError';

            if (errorName === 'TypeError' && errorMessage.includes('fetch')) {
                return {
                    success: false,
                    message: 'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.',
                    error: error
                };
            }

            return {
                success: false,
                message: 'Lỗi không xác định: ' + errorMessage,
                error: error
            };
        }
    }

    // Test connection
    async testConnection(): Promise<ServiceResponse<AttendeeData[]>> {
        if (!this.isConfigured || !this.supabase) {
            return {
                success: false,
                message: 'Supabase chưa được cấu hình',
                error: new Error('Configuration error')
            };
        }

        try {
            console.log('🔍 Testing Supabase connection...');

            const { data, error } = await this.supabase
                .from('attendees')
                .select('*')
                .limit(1);

            if (error) {
                console.error('❌ Connection test failed:', error);
                const errorMessage = 'message' in error ? error.message : 'Unknown connection error';
                return {
                    success: false,
                    message: 'Không thể kết nối Supabase: ' + errorMessage,
                    error: error
                };
            }

            console.log('✅ Supabase connection successful');
            return {
                success: true,
                message: 'Kết nối Supabase thành công!',
                data: data as AttendeeData[]
            };

        } catch (error: unknown) {
            console.error('❌ Connection error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown connection error';

            return {
                success: false,
                message: 'Lỗi kết nối: ' + errorMessage,
                error: error
            };
        }
    }

    // Check configuration
    isReady(): boolean {
        return this.isConfigured && this.supabase !== null;
    }
}

// Export service
const databaseService = new DatabaseService();
export default databaseService;
export type { AttendeeData, ServiceResponse, Database };