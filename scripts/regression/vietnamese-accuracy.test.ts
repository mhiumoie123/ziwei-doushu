import assert from 'node:assert/strict';
import { PROVINCES, getProvinceUtcOffsetMinutes } from '../../lib/ziwei/cities';
import { calcTrueSolarDetail, formToBirthInfo } from '../../lib/ziwei/share';
import {
  getNapAm,
  getMenhCucRelation,
  getTrangSinhMap,
  getVongThaiTueMap,
  getVongBacSiMap,
  getTuanTriet,
  getTieuHanBranch,
  getLuuNienOverlay,
} from '../../lib/ziwei/vietnamese-accuracy';
import type { BirthFormState } from '../../components/BirthForm';

// 1. Đủ 63 tỉnh thành Việt Nam với múi giờ UTC+7 (420 phút) và kinh độ WGS-84 hợp lệ
const vnProvinces = PROVINCES.filter(p => p.name.startsWith('Việt Nam'));
const vnCities = vnProvinces.flatMap(p => p.cities);
assert.equal(vnCities.length, 63, `Phải có đủ 63 tỉnh/thành Việt Nam, hiện có ${vnCities.length}`);
for (const region of vnProvinces) {
  assert.equal(region.utcOffsetMinutes, 420, `${region.name} phải dùng UTC+7 (420 phút)`);
  assert.equal(getProvinceUtcOffsetMinutes(region.name), 420);
  for (const city of region.cities) {
    assert.ok(city.longitude >= 102 && city.longitude <= 110, `Kinh độ ${city.name} (${city.longitude}) ngoài phạm vi VN`);
  }
}

// 2. Chân Thái Dương Thời Việt Nam dùng kinh tuyến chuẩn 105°E (không còn bị trừ oan ~57 phút như 120°E)
const hanoiForm: BirthFormState = {
  name: 'Test VN',
  year: '1995',
  month: '4',
  day: '15', // Ngày 15/4 có EoT ~ 0 phút
  clockHour: '9',
  clockMinute: '10',
  unknownTime: false,
  province: 'Việt Nam · Đồng bằng sông Hồng',
  city: 'Hà Nội',
  longitude: 105.85,
  utcOffsetMinutes: 420,
  gender: 'male',
};
const hanoiSolar = calcTrueSolarDetail(hanoiForm);
assert.ok(hanoiSolar && hanoiSolar.corrected);
assert.ok(Math.abs(hanoiSolar.longitudeCorrectionMinutes - 3.4) < 0.05, 'Hà Nội phải lệch +3.4 phút so với 105°E');
assert.equal(hanoiSolar.branch, 5, '09:10 Hà Nội phải thuộc Giờ Tỵ (5), không bị tụt về Giờ Thìn (4) do lỗi UTC+8');
const hanoiBirth = formToBirthInfo(hanoiForm);
assert.equal(hanoiBirth.hour, 5);
assert.deepEqual(hanoiBirth.origInput, { year: 1995, month: 4, day: 15, clockHour: 9, clockMinute: 10 });

// 3. 60 Lục Thập Hoa Giáp Nạp Âm Bản Mệnh
assert.equal(getNapAm(0, 0).napAm, 'Hải Trung Kim');
assert.equal(getNapAm(1, 1).napAm, 'Hải Trung Kim');
assert.equal(getNapAm(2, 6).napAm, 'Thiên Hà Thủy');
assert.equal(getNapAm(8, 10).napAm, 'Đại Hải Thủy');
assert.equal(getNapAm(9, 11).napAm, 'Đại Hải Thủy');

// 4. Mệnh – Cục tương sinh tương khắc
assert.equal(getMenhCucRelation('Kim', 5).tone, 'great', 'Thổ Ngũ Cục sinh Kim Mệnh → Cục sinh Mệnh');
assert.equal(getMenhCucRelation('Mộc', 4).tone, 'caution', 'Kim Tứ Cục khắc Mộc Mệnh → Cục khắc Mệnh');
assert.equal(getMenhCucRelation('Thủy', 2).tone, 'good', 'Thủy Mệnh gặp Thủy Nhị Cục → Tỷ Hòa');

// 5. Vòng Tràng Sinh
const tsYangMale = getTrangSinhMap(2, 0, 'male'); // Thủy Nhị Cục, Dương Nam → khởi Thân(8) thuận
assert.equal(tsYangMale[8], 'Tràng Sinh');
assert.equal(tsYangMale[9], 'Mộc Dục');
assert.equal(tsYangMale[0], 'Đế Vượng');
const tsYinMale = getTrangSinhMap(6, 1, 'male'); // Hỏa Lục Cục, Âm Nam → khởi Dần(2) nghịch
assert.equal(tsYinMale[2], 'Tràng Sinh');
assert.equal(tsYinMale[1], 'Mộc Dục');

// 6. Vòng Thái Tuế & Bác Sĩ
const tt = getVongThaiTueMap(6); // Tuổi Ngọ
assert.equal(tt[6], 'Thái Tuế');
assert.equal(tt[8], 'Tang Môn');
assert.equal(tt[2], 'Bạch Hổ');
const bs = getVongBacSiMap(0, 'male'); // Giáp (Lộc Tồn ở Dần=2), Dương Nam thuận
assert.equal(bs[2], 'Bác Sĩ');
assert.equal(bs[3], 'Lực Sĩ');

// 7. Tuần & Triệt
assert.deepEqual(getTuanTriet(0, 0), { tuan: [10, 11], triet: [8, 9] }); // Giáp Tý
assert.deepEqual(getTuanTriet(2, 2), { tuan: [10, 11], triet: [4, 5] }); // Bính Dần
assert.deepEqual(getTuanTriet(4, 4), { tuan: [10, 11], triet: [0, 1] }); // Mậu Thìn

// 8. Tiểu Hạn & 9 Sao Lưu Niên (năm Bính Ngọ 2026)
assert.equal(getTieuHanBranch(6, 'male', 2029), 7, 'Nam tuổi Ngọ xem năm Dậu (2029) → Mùi (7)');
assert.equal(getTieuHanBranch(8, 'female', 2023), 3, 'Nữ tuổi Thân xem năm Mão (2023) → Mão (3)');
const ln2026 = getLuuNienOverlay(2026, 6, 'male');
assert.equal(ln2026.canChi, 'Bính Ngọ');
assert.equal(ln2026.luuThaiTueBranch, 6);
assert.ok(ln2026.starsByBranch[6].some(s => s.name === 'Lưu Thái Tuế'));
assert.ok(ln2026.starsByBranch[8].some(s => s.name === 'Lưu Tang Môn'));
assert.ok(ln2026.starsByBranch[2].some(s => s.name === 'Lưu Bạch Hổ'));
assert.ok(ln2026.starsByBranch[5].some(s => s.name === 'Lưu Lộc Tồn'));
assert.ok(ln2026.starsByBranch[6].some(s => s.name === 'Lưu Kình Dương'));
assert.ok(ln2026.starsByBranch[4].some(s => s.name === 'Lưu Đà La'));
assert.ok(ln2026.starsByBranch[8].some(s => s.name === 'Lưu Thiên Mã'));
assert.ok(ln2026.starsByBranch[0].some(s => s.name === 'Lưu Thiên Khốc'));
assert.ok(ln2026.starsByBranch[0].some(s => s.name === 'Lưu Thiên Hư'));

console.log('✅ vietnamese-accuracy regression passed (63 VN provinces UTC+7, Nạp Âm, Tràng Sinh, Thái Tuế, Bác Sĩ, Tuần/Triệt, Tiểu Hạn & 9 Lưu Tinh)');
