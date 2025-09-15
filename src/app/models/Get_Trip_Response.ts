export interface GetTripRes {
  idx: number;
  name: string;
  country: string;
  coverimage: string;
  detail: string;
  price: number;
  duration: number;

  // รองรับทั้งสองกรณี (บาง API อาจส่งอันใดอันหนึ่ง)
  destinationid?: number;         // ← ใช้ตัวนี้ตอนส่ง PUT
  destination_zone?: number | string; // เผื่อฝั่ง GET ส่งชื่อเดิม/สตริง
}
