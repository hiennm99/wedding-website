// databaseService.ts

// Types
interface AttendeeData {
    attendee: string;
    joinable: string;
    transport: string;
    message: string;
}

interface ServiceResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: any;
}

class DatabaseService {
    private apiUrl: string;

    constructor() {
        // Cloudflare Pages Functions API URL
        this.apiUrl = '/api/attendees';
    }

    // Insert data vào Cloudflare D1 Database
    async insertData(data: AttendeeData | AttendeeData[]): Promise<ServiceResponse> {
        try {
            const dataArray = Array.isArray(data) ? data : [data];

            console.log('Sending data to Cloudflare D1:', dataArray);

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ attendees: dataArray })
            });

            const result = await response.json();
            console.log('Cloudflare D1 response:', result);

            if (response.ok && result.success) {
                return {
                    success: true,
                    message: result.message || `Đã thêm ${dataArray.length} record(s) thành công!`,
                    data: result.data
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Lỗi khi thêm data',
                    error: result.error
                };
            }
        } catch (error: any) {
            console.error('Insert data error:', error);
            return {
                success: false,
                message: 'Lỗi kết nối: ' + error.message,
                error: error
            };
        }
    }

    // Get all attendees from Cloudflare D1
    async getAttendees(): Promise<ServiceResponse> {
        try {
            console.log('Fetching data from Cloudflare D1...');

            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('Cloudflare D1 get response:', result);

            if (response.ok && result.success) {
                return {
                    success: true,
                    message: result.message || 'Lấy data thành công!',
                    data: result.data
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Lỗi khi lấy data',
                    error: result.error
                };
            }
        } catch (error: any) {
            console.error('Get data error:', error);
            return {
                success: false,
                message: 'Lỗi kết nối: ' + error.message,
                error: error
            };
        }
    }

    // Test connection
    async testConnection(): Promise<ServiceResponse> {
        try {
            const response = await fetch(this.apiUrl);
            const result = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    message: 'Kết nối D1 database thành công!',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: 'Không thể kết nối D1 database',
                    error: result
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: 'Lỗi kết nối: ' + error.message,
                error: error
            };
        }
    }
}

// Export service
const databaseService = new DatabaseService();
export default databaseService;
export type { AttendeeData, ServiceResponse };