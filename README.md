# Cupmori · คัพมอริ

**ชงความรู้สึก เก็บวันของเรา** · *A little cafe for every feeling.*

แอปคาเฟ่เล็กๆ สำหรับทุกความรู้สึก: เข้าร้าน เจอน้องเป็ดบาริสต้า (เป๊ะ เบอร์รี่ มอส โมโม่ บ็อบบี้) ชงแก้ววันนี้เองทีละขั้น แล้วเก็บเป็นแสตมป์บนปฏิทินรายเดือน

**Phase 2 (branch `app-phase1`)**
- **จดหมายจากขาประจำ:** เรื่องสั้น 3–5 ตอนต่อแขก ปลดล็อกจากจำนวนครั้งที่เจอกัน (ไม่ต้องติดกัน)
- **สมุดสูตร:** 28 สูตร รวมสูตรลับตามช่วงเวลา อากาศ ฤดู และเทศกาล
- **ออเดอร์ลึกลับ:** คำใบ้วันละข้อ ไม่มีหมดเวลา ไม่มีพลาด
- **แต่งร้าน:** ใช้เมล็ดกาแฟที่ได้จากการชงเท่านั้น (ไม่มีขาย)
- **มินิเกมชง:** น้ำแข็ง 0–5 ก้อนที่เห็นจริงในแก้ว กดค้างเทนม ท็อปปิ้ง · แก้วมู้ดไม่มีดาว ดาวและเมล็ดให้เฉพาะแก้วพิเศษ
- วันผึ้งโลก (พ.ค.) พร้อมแขกผึ้งน้อยและเมนูน้ำผึ้ง · ไทย/English · ลดการเคลื่อนไหว · อากาศจริงแบบเลือกเปิด
- ดาวน์โหลดฟรี + ของตกแต่งซื้อครั้งเดียวผ่าน Apple · เลี้ยงกาแฟน้องเป็ดผ่าน Apple เท่านั้น · ไม่มีโฆษณา ไม่มีกล่องสุ่ม

Static web project, framework-free (HTML/CSS/vanilla JS), no build step, local-first. Device features sit behind `platform.js`. Read **[HANDOFF.md](HANDOFF.md)** for the iOS build, IAP catalog and the to-do list. See also [CREDITS.md](CREDITS.md) and [PRIVACY.md](PRIVACY.md).

## Run locally
```
python3 -m http.server 8765   # open http://localhost:8765/
```
Debug params: `?date=2027-05-20` `?t=22:30` `?hemi=S` `?lang=en` `?weather=rain` `?launch=2026-12-01` `?iap=sim` `?dev=1`

QC: `python3 tools/qc_phase2.py` (Playwright + Chrome → `.qc2/`), plus `tools/qc_phase1.py` as a regression check.
English text: edit `tools/i18n-en/*.txt`, then run `python3 tools/build_i18n_en.py`.
