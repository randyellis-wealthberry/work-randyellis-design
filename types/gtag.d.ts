// Google Analytics gtag TypeScript declarations

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js" | "consent" | "custom_map" | "set",
      targetId: string | Date,
      config?: {
        [key: string]: unknown;
        page_title?: string;
        page_location?: string;
        page_path?: string;
        send_page_view?: boolean;
        custom_parameter?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        currency?: string;
        transaction_id?: string;
        affiliation?: string;
        coupon?: string;
        list_name?: string;
        item_list_id?: string;
        item_list_name?: string;
        promotion_id?: string;
        promotion_name?: string;
        creative_name?: string;
        creative_slot?: string;
        items?: Array<{
          item_id?: string;
          item_name?: string;
          item_category?: string;
          item_category2?: string;
          item_category3?: string;
          item_category4?: string;
          item_category5?: string;
          item_variant?: string;
          price?: number;
          quantity?: number;
          item_brand?: string;
          item_list_id?: string;
          item_list_name?: string;
          index?: number;
          promotion_id?: string;
          promotion_name?: string;
          creative_name?: string;
          creative_slot?: string;
          location_id?: string;
        }>;
      },
    ) => void;
    dataLayer: Array<{
      [key: string]: unknown;
    }>;
  }
}

export {};