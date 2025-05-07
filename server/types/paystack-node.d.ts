declare module 'paystack-node' {
  export default class Paystack {
    constructor(secretKey: string);
    
    transaction: {
      initialize: (params: {
        amount: number;
        email: string;
        reference?: string;
        callback_url?: string;
        channels?: string[];
        metadata?: Record<string, any>;
        [key: string]: any;
      }) => Promise<{
        body: {
          status: boolean;
          message: string;
          data: {
            authorization_url: string;
            access_code: string;
            reference: string;
          }
        }
      }>;
      
      verify: (params: {
        reference: string;
      }) => Promise<{
        body: {
          status: boolean;
          message: string;
          data: {
            status: string;
            reference: string;
            amount: number;
            metadata: any;
            [key: string]: any;
          }
        }
      }>;
    };
    
    customer: {
      create: (params: {
        email: string;
        first_name?: string;
        last_name?: string;
        phone?: string;
        metadata?: Record<string, any>;
      }) => Promise<{
        body: {
          status: boolean;
          message: string;
          data: {
            id: number;
            customer_code: string;
            email: string;
            [key: string]: any;
          }
        }
      }>;
    };
  }
}