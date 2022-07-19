export var currency_symbols: {[id: string]: string} = {
    'USD': '$', // US Dollar
    'EUR': '€', // Euro
    'CRC': '₡', // Costa Rican Colón
    'GBP': '£', // British Pound Sterling
    'ILS': '₪', // Israeli New Sheqel
    'INR': '₹', // Indian Rupee
    'JPY': '¥', // Japanese Yen
    'KRW': '₩', // South Korean Won
    'NGN': '₦', // Nigerian Naira
    'PHP': '₱', // Philippine Peso
    'PLN': 'zł', // Polish Zloty
    'PYG': '₲', // Paraguayan Guarani
    'THB': '฿', // Thai Baht
    'UAH': '₴', // Ukrainian Hryvnia
    'VND': '₫', // Vietnamese Dong
};

export var currency_decimals: {[id: string]: number} = {
    'USD': 100, // US Dollar
    'EUR': 100, // Euro
    'CRC': 100, // Costa Rican Colón
    'GBP': 100, // British Pound Sterling
    'ILS': 100, // Israeli New Sheqel
    'INR': 100, // Indian Rupee
    'JPY': 100, // Japanese Yen
    'KRW': 100, // South Korean Won
    'NGN': 100, // Nigerian Naira
    'PHP': 100, // Philippine Peso
    'PLN': 100, // Polish Zloty
    'PYG': 100, // Paraguayan Guarani
    'THB': 100, // Thai Baht
    'UAH': 100, // Ukrainian Hryvnia
    'VND': 100, // Vietnamese Dong
};

export type Basic = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  alt_id: string;
  club_id: number;
  name: string;
  email: string;
  image_url: string;
  cover_photo_url: string;
  type: string;
  home_location_id: number;
  club_name: string;
  access_pin: string;
}

export type Club = {
  id: number;
  name: string;
  image_url: string;
  time_zone: string;
}

export type Identity = {
  id: number;
  uid: string;
  token: string;
  fisikal_token: string;
}

export type Auth = {
  user: User;
  club: Club;
  identity: Identity;
  users: User[];
}

export type ShippingAddress = {
  address_1: string;
  address_2: string;
  address_3: string;
  country_id: number;
  email: string;
  mobile_no: string;
  name: string;
  phone_no: string;
  postcode: string;
  title: string;
  town: string;
  work_no: string;
};

export type UserData = {
  address_1: string;
  address_2: string;
  address_3: string;
  alt_id: string;
  country_id: number;
  cover_photo:  string;
  credit_card: {id: number, title: string}
  default_location_id: number;
  dob: string;
  email: string;
  errors: Array<string>;
  gocardless_mandates: Array<{id: number, title: string}>;
  hashed_permissions: {book_for: Array<number>, email_redirection_for: Array<number>};
  height: number;
  home_location_id: number;
  id: number;
  image: string;
  last_login_at: string;
  linked_clients: Array<number>;
  locale: string;
  main_hand: string;
  mobile_no: string;
  name: string;
  nickname: string;
  phone_no: string;
  postcode: string;
  receive_newsletter: boolean;
  sex: boolean;
  shipping_address: ShippingAddress;
  strike_count: number;
  strike_out_from: string;
  strike_out_till: string;
  title: string;
  town: string;
  wallet_enabled: boolean;
  weight: number;
  work_no: string;
};

export type ClubSettings = {
  id: number;
  locale: string;
  booking_minutes_interval: number;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  club_logo_url: string;
  client_default_cover_wall_url: string;
  trainer_default_cover_wall_url: string;
  golfzone_integration_enabled: boolean;
  strike_service_category_ids: Array<string | number>;
  strike_service_ids: Array<string | number>;
  other_locales: Array<string>;
  access_control_enabled: boolean;
  otp_interval: number;
  wallet_settings: {
    wallet_enabled: boolean;
    wallet_name: string;
    wallet_balance_expiry_after: number;
    wallet_balance_expiry_after_unit: string;
    wallet_minimum_activate_balance: number;
  }
}

export type Occurrence = {
  actions: Array<string>;
  activity_category_id: number;
  attended_clients_count: number;
  can_be_prompted: boolean;
  can_be_rated: boolean;
  duration_in_hours: number;
  duration_in_minutes: number;
  id: number;
  is_joined: boolean;
  is_online: boolean;
  is_readonly: boolean;
  is_requested: boolean;
  is_waiting: boolean;
  livestream_available_after: string;
  livestream_available_prior: string;
  livestream_origin: string;
  livestream_url: string;
  livestream_vimeo_id: number;
  livestream_youtube_id: number;
  location_name: string;
  lock_version: number;
  occurs_at: string;
  position_on_waiting_list: number;
  restrict_to_book_in_advance_time_in_days: number;
  restrict_to_book_in_advance_time_in_hours: number;
  seconds_until_booking_open: number;
  service_description: string;
  service_group_size: number;
  service_id: number;
  service_logo_url: string;
  service_title: string;
  show_free_spaces: boolean;
  sub_location_name: string;
  trainer_id: number;
  trainer_name: string;
};

export type Country = {
  id: number;
  name: string;
  abbr: string;
  dialing_code: string;
};

export type Service = {
  declaration: string;
  duration_in_hours: number;
  duration_in_minutes: number;
  group_size: number;
  id: number;
  logo_url: string;
  service_image_url: string;
  service_title: string;
  show_free_spaces: boolean;
  starred: boolean;
  video_url: string;
};

export type ServiceCategory = {
  id: number;
  name: string;
  name_in_member_app: string;
  description: string;
  logo_url: string;
  video_url: string;
}

export type DirectoryOpeningHours = {
  id: number;
  directory_id: number;
  title: string;
  start_time: string;
  end_time: string;
}

export type Directory = {
  id: number;
  location_id: number;
  description: string;
  image_url: string;
  address: string;
  postcode: string;
  phone_no: string;
  cover_image_urls: Array<string | number>;
  name: string;
  schedule_pdf_url: string;
  link_to_pdf_enabled: boolean;
  service_category: ServiceCategory;
  link_to_schedule_enabled: boolean;
  opening_hours: Array<DirectoryOpeningHours>;
}

export type Location = {
  alt_id: string;
  directory: Directory;
  directory_is_enabled: boolean;
  hidden: boolean;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  number: number;
  parent_id: number;
  parent_name: string;
  region_id: number;
  short_code: string;
};

export type LocationData = {
  id: number;
  parent_id: number;
  hidden: boolean;
  region_id: number;
  alt_id: number;
  name: string;
  short_code: string;
  number: number;
  latitude: number;
  longitude: number;
  directory_is_enabled: boolean;
  parent_name: string;
  directory: Directory;
}

export type TagCategory = {
  id: number;
  disabled: boolean;
  human_user_visibility: Array<string | number>;
  translations: Array<string | number>;
  tag_category_entities: Array<string | number>;
  logo_url: string;
}

export type Tag = {
  id: number;
  name: string;
  description: string;
  translations: string;
  tag_image_url: string;
  editable: boolean;
  tag_category: TagCategory;
}

export type Trainer = {
  id: number;
  name: string;
  type: string;
  email: string;
  alt_id: string;
  image: string;
}

export type TrainerData = {
  id: number;
  name: string;
  email: string;
  qualifications: string;
  bio: string;
  type: string;
  image: string;
  cover_photo: string;
  relationships: {
    has_package_with: number;
    has_booking_with: number;
    has_assessment_with: number;
    has_workout_from: number;
    is_allocated_to: number;
    has_active_package_with: number;
  };
  tags: Array<Tag>;
}

export type TrainerActivity = {
  id: number;
  trainer: Trainer;
  service: Service;
  location: LocationData;
}

export type ServicePackage = {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  service_package_image_url: string;
  video: {
    player_url: string;
    file_url: string;
  };
  price: {
    amount: number;
    currency_code: string;
  };
  custom_price: {
    amount: number;
    currency_code: string;
  };
  product_id: number;
  disabled: boolean;
  subscribed: boolean;
  subscribable: boolean;
  pause_allowance_enabled: boolean;
  pause_allowance_type: string;
  pause_allowance_limit: number;
  restrict_bookings_to_payee: boolean;
  payee_id: number;
  user_visibility: Array<string>;
  subscription_payment_type: string;
  service_package_services: Array< {id: number; amount: number; price: number;} >;
}

export type ClientServicePackage = {
  id: number;
  assigned_at: string;
  expires_at: string;
  total_credits: number;
  used_credits: number;
  refunded: number;
  paused: boolean;
  pause_start_on: string;
  pause_end_on: string;
  cost_discount: {
    amount: number;
    currency_code: string;
  };
  service_package: ServicePackage;
};

export type Section = {
  id: number;
  section: string;
  title: string;
  service_categories: Array<ServiceCategory>;
}

export type Timeslot = {
  since: string;
  till: string;
  trainer_activity: TrainerActivity[];
}

export type Notification =  {
  id: number;
  notification_settings_set_id: number;
  key: string;
  created_at: string;
  updated_at: string;
  to_client: boolean;
  to_trainer: boolean;
  to_manager: boolean;
  to_front_house_manager: boolean;
  to_system: boolean;
  to_administrator: boolean;
  to_self_employed: boolean;
  to_independent_trainer: boolean;
  to_sjd_accountant: boolean;
  to_content_provider: boolean;
  to_accountant: boolean;
  to_content_user: boolean;
  to_pt_manager: boolean;
}

export type NotificationSettingsSet = {
  id: number;
  club_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  lead_client_name: string;
  global_notifications_enabled_by_lead_client: boolean;
  notification_settings: Array<Notification>;
}

export type LinkedClient = {
  id: number;
  name: string;
  image_url: string;
  dob: string;
  hashed_permissions: {
    book_for: Array<number | string>;
    email_redirection_for: Array<number | string>;
  }
}

export type ServicePackageShow = {
  id: number;
  name: string;
  description: string;
  logo_url: string;
  service_package_image_url: string;
  video: {
    player_url: string;
    file_url: string;
  };
  price: {
    amount: number;
    currency_code: string;
  };
  custom_price: {
  amount: number;
  currency_code: string;
  };
  single: boolean;
  expirable: boolean;
  expires_period_type: string;
  expires_in: number;
  expires_ends_in: number;
  bookings_limit: number;
  product_id: number;
  service_package_services: [ {id: number; amount: number; service: Service } ];
  disabled: boolean;
  subscribed: boolean;
  subscribable: boolean;
  pause_allowance_enabled: boolean;
  pause_allowance_type: string;
  pause_allowance_limit: number;
  user_visibility: Array<string>;
  subscription_payment_type: string;
  restrict_bookings_to_payee: boolean;
  payee_id: number;
  tags: [ Tag ];
  service_package_tags: [ Tag ];
}

export type EntryPoint = {
  classes: boolean;
  locations: boolean;
  class_types: boolean;
  instructors: boolean;
  services: boolean;
}

export type Transaction = {
  id: number;
  created_at: string;
  paid_at: string;
  quantity: number;
  section: string;
  product_name: string;
  transaction_type: string;
  reference: string;
  document_ref: string;
  note: string;
  created_by: string;
  code: string;
  payment_method: string;
  payee: string;
  client_name: string;
  location_name: string;
  installment_number: number;
  installments_count: number;
  balance: string;
  amount: string;
  total: any;
  discounts_amount: string;
  receipt_url: string;
  payment_id: number;
  client_id: number;
}

export type SpreedlyJson = {
  amount: string;
  company_name: string;
  full_name: string;
  email: string;
  order_id: number;
  payment_provider: string;
  url_schema: string;
  key: string;
}