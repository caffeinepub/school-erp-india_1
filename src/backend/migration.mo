import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";

module {
  type NotificationChannel = {
    email : Bool;
    sms : Bool;
    push : Bool;
    rcs : Bool;
    whatsapp : Bool;
    inApp : Bool;
  };

  type NotificationRecipientGroup = {
    teachers : Bool;
    students : Bool;
    parents : Bool;
    staff : Bool;
    admins : Bool;
  };

  type CredentialRecord = {
    userId : Text;
    hashedPassword : Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type PaymentRecord = {
    id : Nat;
    studentId : Text;
    amount : Nat;
    monthsPaid : [Text];
    paymentGateway : Text;
    timestamp : Time.Time;
    receiptNumber : Text;
  };

  type NotificationRuleRecord = {
    id : Nat;
    eventType : Text;
    timing : Text;
    channels : NotificationChannel;
    recipientGroups : NotificationRecipientGroup;
    isActive : Bool;
    createdAt : Time.Time;
    updatedAt : Time.Time;
  };

  type AttendanceScanRecord = {
    id : Nat;
    studentId : Text;
    timestamp : Time.Time;
    scannedBy : Text;
    deviceRole : Text;
  };

  type RCSMessageRecord = {
    id : Nat;
    recipient : Text;
    message : Text;
    timestamp : Time.Time;
    status : Text;
  };

  type NewActor = {
    credentialRecords : Map.Map<Text, CredentialRecord>;
    paymentRecords : Map.Map<Nat, PaymentRecord>;
    notificationRuleRecords : Map.Map<Nat, NotificationRuleRecord>;
    attendanceScanRecords : Map.Map<Nat, AttendanceScanRecord>;
    rcsMessageRecords : Map.Map<Nat, RCSMessageRecord>;
    nextPaymentId : Nat;
    nextNotificationRuleId : Nat;
    nextAttendanceScanId : Nat;
    nextRCSMessageId : Nat;
  };

  public func run(_old : {}) : NewActor {
    {
      credentialRecords = Map.empty<Text, CredentialRecord>();
      paymentRecords = Map.empty<Nat, PaymentRecord>();
      notificationRuleRecords = Map.empty<Nat, NotificationRuleRecord>();
      attendanceScanRecords = Map.empty<Nat, AttendanceScanRecord>();
      rcsMessageRecords = Map.empty<Nat, RCSMessageRecord>();
      nextPaymentId = 1;
      nextNotificationRuleId = 1;
      nextAttendanceScanId = 1;
      nextRCSMessageId = 1;
    };
  };
};
