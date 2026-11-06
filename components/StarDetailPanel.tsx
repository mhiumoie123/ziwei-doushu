'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';
import { translateStarName, translatePalaceName } from '@/lib/ziwei/vietnamese';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// 倪海厦体系各星详细解读（参考顾祥弘《飞星紫微斗数全书》及南北山人《紫微斗数全书》）
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  classical: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  '紫微': {
    niHaixia: 'Thầy Nghê cho rằng Tử Vi là Hoàng Đế Tinh, tọa thủ cung Mệnh mang khí phách cô cao, thích độc lập, không thích bị người khác quản thúc. Tử Vi cần có Tả Phụ Hữu Bật giáp mệnh hoặc hội chiếu mới phát huy hết khí chất đế vương, bằng không chỉ là quân vương cô độc, phú mà không quý. Tử Vi tại Thìn Tuất là đắc địa nhất, cùng Thiên Phủ đồng cung tạo thành cách Tử Phủ Đồng Cung tài quan song mỹ, có thể xuất tướng nhập tướng. Tử Vi ngại nhất Hỏa Tinh, Linh Tinh, Kình Dương, Đà La đồng cung, gia sát thì cô độc bớt quý, có quyền mà giảm tài.',
    classical: 'Cổ quyết: "Tử Vi đế tọa lâm mệnh chủ tôn quý, thống lĩnh quần tinh, tọa mệnh chủ quyền uy hiển đạt." Nam Bắc Sơn Nhân chú: "Tử Vi thủ mệnh vu Thìn vị, tài quan song mỹ, xuất tướng nhập tướng, vị chí tam công; Tý cung an mệnh giả, phú quý bất nại cửu, nhật hậu bất mỹ."',
    bestPalace: 'Cung Mệnh (Thìn Tuất), Cung Quan Lộc',
    worstPalace: 'Cung Tật Ách, Cung Phu Thê',
    career: 'Chính giới, quản lý cấp cao, khởi nghiệp độc lập, khí chất đế vương bẩm sinh, thích hợp cương vị lãnh đạo gánh vác đại cuộc',
    relationship: 'Tình cảm có phần bị động, lòng tự tôn cao, cần đối phương chủ động thấu hiểu, có xu hướng cô độc, kết hôn muộn thì cát',
    wealth: 'Tài vận ổn định, giữ của tốt hơn mạo hiểm, tại Thìn Tuất tài quan song mỹ, rất thích hợp tích lũy đầu tư dài hạn',
    health: 'Hành Thổ, lưu ý tỳ vị, hệ tiêu hóa. Tránh lao lực quá độ, nên duy trì sinh hoạt điều độ',
  },
  '天机': {
    niHaixia: 'Thầy Nghê dạy Thiên Cơ là Tham Mưu Tinh, là vì sao thông minh tột bậc, nhưng thông minh lộ ra ngoài quá dễ tự hại mình. Thiên Cơ Hóa Kỵ phiền toái nhất, tượng trưng cho thông minh quá hóa vụng (thông minh phản bị thông minh ngộ). Thiên Cơ thuộc Mộc, thiện biến linh hoạt, thủ mệnh tư duy mau lẹ, nhưng hay mưu tính nhiều mà quyết đoán ít, nên ly hương xuất ngoại phát triển mới đại thành.',
    classical: 'Cổ quyết: "Vi nhân sinh tinh hoạt, tự hảo tác kinh doanh, Thiên Cơ tinh thuộc mộc, thương mãi giai đa cơ kiến, ly tông tất viễn thân." Nam Bắc Sơn Nhân chú: "Thiên Cơ cư miếu vượng địa, chủ nhân sinh tinh minh, thiện sách hoạch; cư hãm địa tắc ám đạm."',
    bestPalace: 'Cung Mệnh (cung Mão), Cung Quan Lộc',
    worstPalace: 'Cung Phu Thê',
    career: 'Chuyên gia kỹ thuật, mưu sĩ, nghiên cứu, IT, hoạch định chiến lược, dụng não hơn dụng sức, thích hợp ly hương phát triển',
    relationship: 'Tình cảm đa biến, suy nghĩ quá nhiều khó chuyên nhất, nên kết hôn muộn, sau hôn nhân cần học cách buông bỏ ưu tư',
    wealth: 'Kiếm tiền bằng trí tuệ và chuyên môn, không giỏi giữ tiền mặt, lấy kỹ năng chuyên nghiệp làm gốc thì tài vận vững vàng',
    health: 'Hành Mộc, chú ý gan mật, hệ thần kinh. Suy nghĩ quá nhiều dễ mất ngủ, nên rèn luyện tĩnh tâm thiền định',
  },
  '太阳': {
    niHaixia: 'Thầy Nghê nhìn nhận Thái Dương mang khí chất đại trượng phu, từ Mão đến Ngọ nhập miếu quang minh chính đại; sau giờ Ngọ ánh sáng giảm dần. Thái Dương thủ mệnh tính tình hào sảng trọng thể diện, nam mệnh rất đắc cách, nữ mệnh thì quá mạnh mẽ độc lập. Thái Dương tượng trưng cho người cha và cấp trên, chủ quang minh lỗi lạc, rất thích hợp công chức sự nghiệp công chúng.',
    classical: 'Cổ quyết: "Thái Dương cư Ngọ vi nhập miếu, quang huy đại phóng, chủ quý hiển, nam mệnh tối giai; lạc hãm tắc cô quả lao lục, tiên cần hậu lại."',
    bestPalace: 'Cung Mệnh (Mão đến Ngọ), Cung Quan Lộc',
    worstPalace: 'Cung Phu Thê (đối với nữ mệnh), Cung Tật Ách',
    career: 'Công chức, chính giới, quản lý, quan hệ công chúng, giáo dục, truyền thông, thích hợp sự nghiệp vì cộng đồng',
    relationship: 'Nam mệnh đào hoa duyên tốt, nữ mệnh độc lập mạnh mẽ, hôn nhân cần bao dung thấu hiểu, nên tìm bạn đời dịu dàng',
    wealth: 'Tài lộc đến từ sự tận tụy nỗ lực, tính tình hào phóng thích giúp đỡ, nhập miếu tài vận thịnh vượng, lạc hãm thì thăng trầm',
    health: 'Hành Hỏa, lưu ý tim mạch, huyết áp và thị lực (mắt). Vị trí lạc hãm dễ lao lực, cần chú ý nghỉ ngơi đầy đủ',
  },
  '武曲': {
    niHaixia: 'Thầy Nghê định nghĩa Vũ Khúc là Tài Bạch Chủ Tinh, cương nghị bất khuất, sợ nhất tính cô khắc. Vũ Khúc thủ mệnh ý chí sắt đá, rất giỏi tài chính quản lý tiền tệ, nhưng trong tình cảm quá thẳng thắn dễ làm tổn thương người khác. Vũ Khúc Hóa Kỵ cần đề phòng huyết quang bất ngờ. Vũ Khúc tại Thìn Tuất Sửu Mùi đắc vượng địa, ngộ Thất Sát đồng cung tạo nên cách Tướng Tài đại quý.',
    classical: 'Cổ quyết: "Vũ Khúc thuộc kim, cương cường chi tính, nhất sinh đa hình khắc; thủ mệnh vu vượng địa, xuất tướng nhập tướng."',
    bestPalace: 'Cung Mệnh (Thìn Tuất Sửu Mùi), Cung Tài Bạch, Cung Quan Lộc',
    worstPalace: 'Cung Phu Thê',
    career: 'Tài chính ngân hàng, quân cảnh, kế toán kiểm toán, kỹ thuật cơ khí, năng lực hành động và quyết đoán vượt trội',
    relationship: 'Tình cảm thẳng thắn bộc trực, thiếu chút lãng mạn tinh tế, cần người bạn đời dịu dàng bù trừ hòa hợp',
    wealth: 'Tài tinh bản mệnh, tài vận cực mạnh, năng lực làm giàu và quản lý tài chính siêu quần, Thìn Tuất tài quan song mỹ',
    health: 'Hành Kim, lưu ý phổi, hệ hô hấp, răng và xương khớp. Khi Hóa Kỵ cần cẩn trọng phòng ngừa tai ách va chạm huyết quang',
  },
  '天同': {
    niHaixia: 'Thầy Nghê gọi Thiên Đồng là Phúc Tinh, là vì sao an nhàn hưởng lạc nhất. Thiên Đồng thủ mệnh chuộng hưởng phúc, không ưa tranh giành bon chen, thích hợp công việc ổn định bình an. Thiên Đồng cùng Thiên Lương đồng cung là thượng cách, vừa được hưởng phúc vừa có che chở. Thiên Đồng Hóa Lộc là hóa lộc êm đềm nhất, chủ đời người áo cơm no đủ, an nhiên tự tại.',
    classical: 'Cổ quyết: "Thiên Đồng vi phúc đức chi tinh, tọa mệnh giả hưởng phúc hữu dư, chủ nhất sinh tiêu dao tự tại, bất tất lao khổ."',
    bestPalace: 'Cung Mệnh, Cung Phúc Đức',
    worstPalace: 'Cung Quan Lộc',
    career: 'Dịch vụ, giải trí, ẩm thực, văn nghệ nghệ thuật, môi trường làm việc thoải mái hòa đồng, tránh cạnh tranh khốc liệt',
    relationship: 'Tình cảm dịu dàng, tính cách hòa nhã đáng mến, dễ đón nhận tình cảm, đời sống hôn nhân tương đối êm ấm',
    wealth: 'Tài lộc bình ổn, nhờ lương bổng và tích lũy an toàn, không giỏi đầu cơ mạo hiểm, cả đời ấm no không lo thiếu thốn',
    health: 'Hành Thủy, lưu ý thận, bàng quang, hệ bài tiết. Thể chất thiên về nhu, nên vận động điều độ để tăng cường sinh lực',
  },
  '廉贞': {
    niHaixia: 'Thầy Nghê coi Liêm Trinh là Thứ Đào Hoa, tài hoa xuất chúng nhưng tình cảm thăng trầm. Liêm Trinh Hóa Kỵ rất hung hiểm, chủ về kiện tụng thị phi, tai ương hoặc họa lao ngục. Nhưng Liêm Trinh đồng cung cùng Thiên Tướng lại hóa hung thành cát, trở thành Liêm Tướng Cách - cách cục hành chính ấn thụ nắm quyền bính. Liêm Trinh thuộc Hỏa, tính khí cương liệt, giữ tâm chính trực ắt thành đại nghiệp.',
    classical: 'Cổ quyết: "Liêm Trinh vi thứ đào hoa, tài hoa hoành dật, cảm tình đa ba chiết; Liêm Tướng đồng cung, hóa hung vi cát, thành hành chính ấn thụ cách."',
    bestPalace: 'Cung Quan Lộc (hội Thiên Tướng), Cung Mệnh (khi Hóa Lộc)',
    worstPalace: 'Cung Mệnh (khi Hóa Kỵ), Cung Phu Thê',
    career: 'Nghệ thuật, giải trí, pháp luật, công chức tư pháp (hội Thiên Tướng), tài hoa trác tuyệt, đi con đường chính đạo sẽ bền lâu',
    relationship: 'Đào hoa nhiều, tình cảm phong phú phức tạp dễ vướng rắc rối ái tình, nên kết hôn muộn và chọn bạn đời chững chạc',
    wealth: 'Tài vận thăng trầm, kiếm tiền từ tài hoa chuyên môn, khi Hóa Kỵ cần tuyệt đối phòng ngừa tranh chấp pháp lý tài chính',
    health: 'Hành Hỏa, lưu ý tim mạch, tuần hoàn máu, gan. Khi Hóa Kỵ cẩn trọng va chạm tai nạn, giữ gìn thân thể',
  },
  '天府': {
    niHaixia: 'Thầy Nghê giảng Thiên Phủ là Tài Khố Tinh (kho tiền), là sao thủ thành, không chủ động bộc phát liều lĩnh nhưng giữ gìn cơ nghiệp cực kỳ vững chãi. Thiên Phủ thủ mệnh tính tình trầm ổn bao dung, nữ mệnh rất tốt, có tài vượng phu ích tử. Thiên Phủ thích nhất cùng Tử Vi đồng cung hoặc đối chiếu thành song tinh cách. Thiên Phủ ngại nhất Không Kiếp giáp hoặc hội tụ, vì Không Kiếp làm thủng kho tiền.',
    classical: 'Cổ quyết: "Thiên Phủ vi tài khố chi tinh, thủ mệnh giả ổn trọng bảo thủ, chủ tích tài vượng gia; nữ mệnh phùng chi, năng vượng phu ích tử, gia đạo hưng long."',
    bestPalace: 'Cung Mệnh, Cung Tài Bạch, Cung Điền Trạch',
    worstPalace: 'Cung Thiên Di',
    career: 'Quản trị hành chính, tài chính kế toán, ngân hàng bảo hiểm, bất động sản, thích hợp các ngành nghề cần sự ổn định bền vững',
    relationship: 'Tình cảm chung thủy, rất biết vun vén gia đình, là chỗ dựa vững chãi, coi trọng cảm giác an toàn và kinh tế gia đạo',
    wealth: 'Tài lộc dồi dào vững bền, năng lực tích lũy tài sản trác tuyệt, rất thích hợp đầu tư bất động sản và tích sản dài hạn',
    health: 'Hành Thổ, lưu ý tỳ vị, tiêu hóa dạ dày. Thể chất ổn định, nên duy trì chế độ ăn uống khoa học điều độ',
  },
  '太阴': {
    niHaixia: 'Thầy Nghê nhìn nhận Thái Âm là Phú Tinh, đắc lợi cho nữ mệnh, đồng thời đại diện cho người mẹ và người vợ của nam mệnh. Thái Âm nhập miếu tài vận dồi dào thanh nhã, hãm địa thì trắc trở lo âu. Thái Âm Hóa Kỵ cần lưu ý sức khỏe mẹ hoặc vợ. Thái Âm tại Hợi Tý nhập miếu nguyệt lãng thiên môn, biểu thị vẻ đẹp tao nhã, tình cảm sâu sắc và thế giới nội tâm phong phú.',
    classical: 'Cổ quyết: "Thái Âm vi tài tinh, lợi nữ mệnh; Hợi Tý nhập miếu, quang huy toàn chiếu, tài vận cực vượng; Ngọ vị lạc hãm, ưu uất đa tình."',
    bestPalace: 'Cung Mệnh (Hợi Tý), Cung Tài Bạch',
    worstPalace: 'Cung Mệnh (Ngọ vị hãm địa)',
    career: 'Tài chính, bất động sản, nghệ thuật văn hóa, giáo dục, công việc đòi hỏi sự chu đáo, thẩm mỹ và kiên nhẫn',
    relationship: 'Tình cảm dịu dàng sâu lắng, trọng đời sống tinh thần, cần một mối quan hệ thủy chung, mang lại cảm giác bình yên',
    wealth: 'Nhập miếu tài vận rất thịnh vượng tích lũy lớn; giỏi quản lý chi tiêu cẩn thận, không thích trò chơi may rủi phiêu lưu',
    health: 'Hành Thủy, lưu ý thận, hệ nội tiết, sức khỏe phụ khoa (nữ). Tâm trạng dễ dao động ảnh hưởng sức khỏe, nên giữ tâm an lạc',
  },
  '贪狼': {
    niHaixia: 'Thầy Nghê nhận định Tham Lang là vì sao đa tài đa nghệ nhất và cũng đào hoa nhất. Tham Lang Hóa Lộc nhập mệnh thì quyến rũ mê hoặc, đi đâu cũng được người yêu mến. Tham Lang thuộc nhóm phát muộn (vãn phát), thường ngoài ba mươi mới định hình thành tựu lớn. Tham Lang tại Dần Thân nhập miếu tài nghệ tuyệt vời, ngộ Hỏa Linh đồng cung thành Hỏa Tham Linh Tham phát tài bộc phát.',
    classical: 'Cổ quyết: "Tham Lang phát phúc hanh thông, đa tài đa nghệ, đào hoa tối trọng; vãn phát giả chúng. Lạc hãm ngộ sát phản cát."',
    bestPalace: 'Cung Mệnh (khi Hóa Lộc), Cung Phúc Đức, Cung Thiên Di',
    worstPalace: 'Cung Tật Ách',
    career: 'Nghệ thuật giải trí, đối ngoại, kinh doanh thương mại, ngoại giao, phong thủy huyền học, tận dụng nhân mạch và tài năng',
    relationship: 'Đào hoa cực vượng, nhiều mối duyên cuốn hút, nên kết hôn muộn, sau hôn nhân cần giữ mình mới bền vững trọn đời',
    wealth: 'Kiếm tiền từ tài hoa và quan hệ xã hội, trung hậu vận tài vận càng thêm hưng thịnh, gặp thời bùng nổ tài lộc lớn',
    health: 'Hành Mộc đới Thủy, lưu ý gan, thận, hệ sinh dục. Hoạt động xã giao nhiều dễ hao tổn nguyên khí, cần tiết chế bồi dưỡng',
  },
  '巨门': {
    niHaixia: 'Thầy Nghê cho rằng Cự Môn là Ám Tinh chủ về khẩu thiệt thị phi, nhưng khi Hóa Lộc Hóa Quyền lại biến thành đại cát cách, lập nghiệp nhờ khẩu tài hùng biện. Cự Môn tọa Mệnh tính hay đa nghi quan sát sâu sắc, thích hợp làm luật sư, giảng viên, truyền thông. Cự Môn sợ nhất Hóa Kỵ vì dễ vướng khẩu thiệt thị phi kiện tụng. Tại Tý Ngọ thạch trung ẩn ngọc, lấy tài năng phát tiết mà thành danh.',
    classical: 'Cổ quyết: "Cự Môn vi ám diệu, chủ khẩu thiệt thị phi; hóa Lộc Quyền tắc chuyển vi dĩ khẩu tài mưu sinh, chủ phú quý."',
    bestPalace: 'Cung Quan Lộc (Hóa Lộc/Quyền), Cung Mệnh (Tý Ngọ)',
    worstPalace: 'Cung Phu Thê, Cung Tật Ách (khi Hóa Kỵ)',
    career: 'Luật sư, nhà giáo, chuyên gia đàm phán, người dẫn chương trình, ngoại giao, khẩu tài hùng biện là vũ khí cạnh tranh',
    relationship: 'Nội tâm hay trăn trở đa nghi, dễ suy nghĩ nhiều, thấu hiểu và giao tiếp chân thành là chìa khóa hôn nhân êm ấm',
    wealth: 'Kiếm tiền nhờ tài hùng biện và kiến thức chuyên môn, Hóa Lộc tài vận tốt, Hóa Kỵ phòng ngừa thị phi liên lụy tiền nong',
    health: 'Hành Thủy, lưu ý thận, đường hô hấp, thanh quản, vòm họng. Tránh lo âu ưu tư thái quá làm tổn thương tạng phủ',
  },
  '天相': {
    niHaixia: 'Thầy Nghê dạy Thiên Tướng là Ấn Thụ Tinh, chủ trì việc hành chính phụ tá. Thiên Tướng thủ mệnh tính nết ngay thẳng chuẩn mực, thích hợp công chức quản lý nhà nước. Thiên Tướng cần có sao mạnh dẫn dắt mới phát huy tối đa quyền năng. Thiên Tướng thích nhất sánh đôi cùng Liêm Trinh thành cách Liêm Tướng nắm quyền; sợ nhất Phá Quân hoặc Hóa Kỵ Kình Dương giáp thành Hình Kỵ Giáp Ấn.',
    classical: 'Cổ quyết: "Thiên Tướng vi ấn thụ chi tinh, chủ hành chính thứ vụ; Liêm Tướng đồng cung, hóa hung vi cát, chưởng hành chính đại quyền."',
    bestPalace: 'Cung Quan Lộc, Cung Mệnh (hội Liêm Trinh)',
    worstPalace: 'Cung Tài Bạch, Cung Mệnh (khi ngộ Hình Kỵ Giáp Ấn)',
    career: 'Công chức, quản lý hành chính, tham mưu, trợ lý đắc lực, pháp luật, chuyên trách công tác hỗ trợ và điều phối quy mô lớn',
    relationship: 'Tình cảm nghiêm túc, thủy chung đôn hậu, là người bạn đời mẫu mực, thường mong muốn đối phương chủ động đồng hành',
    wealth: 'Tài vận bình ổn, thu nhập từ bổng lộc thực chất, không phù hợp đầu tư liều lĩnh mạo hiểm, tích lũy an toàn là tối thượng',
    health: 'Hành Thủy, lưu ý thận, hệ bài tiết, hệ bạch huyết. Thể chất điều hòa, nên duy trì nếp sống khoa học đúng giờ',
  },
  '天梁': {
    niHaixia: 'Thầy Nghê nhấn mạnh Thiên Lương là Ấm Tinh (che chở), có khả năng giải ách trừ hung, đồng thời tượng trưng cho y đạo, tôn giáo, bảo hiểm. Người có Thiên Lương thủ mệnh có duyên với bậc trưởng bối, tiền vận chịu nhiều thử thách rèn luyện, hậu vận an nhàn hưởng phúc. Thiên Lương sợ nhất Hóa Kỵ chủ thị phi từ người lớn tuổi. Cùng Thái Dương đồng cung tại Mão là Nhật Xuất Lôi Môn đại quý.',
    classical: 'Cổ quyết: "Thiên Lương vi ấm tinh, chủ tí ấm bảo hộ; tọa mệnh giả hữu trường bối duyên, tảo niên thụ ma luyện, vãn niên hưởng thanh phúc."',
    bestPalace: 'Cung Mệnh, Cung Phụ Mẫu, Cung Phúc Đức',
    worstPalace: 'Cung Mệnh (khi Hóa Kỵ), Cung Tài Bạch',
    career: 'Y dược y tế, pháp luật thẩm phán, công tác xã hội thiện nguyện, bảo hiểm, nghiên cứu văn hóa truyền thống',
    relationship: 'Thường có duyên với người chênh lệch tuổi tác hoặc kết hôn muộn, cần sự kiên nhẫn và thấu hiểu mới kết duyên lành',
    wealth: 'Tài lộc có quý nhân nâng đỡ, tiền vận thanh đạm, hậu vận điền sản tài sản mới vững vàng dồi dào, lấy đức tích tài',
    health: 'Hành Thổ, lưu ý tỳ vị dạ dày, xương khớp, sống lưng. Cần chú trọng chăm sóc sức khỏe định kỳ khi về già',
  },
  '七杀': {
    niHaixia: 'Thầy Nghê ví Thất Sát như vị Đại Tướng Quân sa trường, tính khí quả quyết dũng mãnh dám xông pha, nhưng mang tính cô khắc. Thất Sát thủ mệnh rất cần có các cát tinh phụ tá dung hòa bớt tính sát, bằng không lục thân duyên phận có phần đạm bạc. Thất Sát cùng Vũ Khúc đồng cung là Tướng Tài Cách cực kỳ oai phong. Thất Sát ngại nhất gặp Kình Đà Hỏa Linh hội tụ xung sát, cần đề phòng thương tật.',
    classical: 'Cổ quyết: "Thất Sát vi tướng quân chi tinh, quả quyết xung kình cường; thủ mệnh giả cô khắc tính trọng, lục thân duyên bạc."',
    bestPalace: 'Cung Mệnh (hội cát tinh), Cung Quan Lộc',
    worstPalace: 'Cung Phu Thê, Cung Phụ Mẫu',
    career: 'Quân đội công an, khởi nghiệp khai phá thị trường mới, tài chính chứng khoán, công nghiệp nặng, quyết đoán dám chịu trách nhiệm',
    relationship: 'Cá tính độc lập mạnh mẽ, khó chiều lòng, cần người bạn đời giàu lòng vị tha và thấu hiểu cá tính, nên kết hôn muộn',
    wealth: 'Tài vận biến động lớn, có cơ hội bứt phá làm giàu vang dội; đồng cung Vũ Khúc tạo thành cách cục Tướng Tài đại phú đại quý',
    health: 'Hành Kim đới Hỏa, lưu ý phổi, đại tràng, hệ hô hấp. Tính nóng vội dễ tổn thần, nên rèn luyện tâm tính điềm tĩnh',
  },
  '破军': {
    niHaixia: 'Thầy Nghê giảng Phá Quân là dũng tướng tiên phong phá cũ lập mới, đồng thời cũng là sao có tính cô độc biến động lớn. Phá Quân khi Hóa Lộc mới trở nên toàn vẹn, đại diện cho việc phá tan cái cũ để dựng xây nên cái mới huy hoàng. Phá Quân thủ mệnh giàu tinh thần cải cách, dám làm những điều người khác không dám làm, đi con đường chưa ai từng đi, một đời oanh liệt.',
    classical: 'Cổ quyết: "Phá Quân vi tối năng phá cựu lập tân chi tinh, tọa mệnh giả cô khắc... khai sáng năng lực siêu cường; hóa Lộc hậu phá nhi hậu lập, khả thành đại nghiệp."',
    bestPalace: 'Cung Quan Lộc (khi Hóa Lộc), Cung Thiên Di',
    worstPalace: 'Cung Phu Thê, Cung Phụ Mẫu',
    career: 'Khởi nghiệp công nghệ mới, tiên phong khai hoang, quản lý biến đổi doanh nghiệp, nghiên cứu đột phá, dẫn đầu xu thế',
    relationship: 'Tình cảm nhiều thăng trầm biến động, hợp tan bất thường, cần người bạn đời có tư duy độc lập và bao dung rộng lượng',
    wealth: 'Tài vận thăng trầm như thủy triều, Hóa Lộc tài lộc bùng nổ mạnh mẽ; giữ nguyên lối cũ thì thoái tài, không ngừng đổi mới thì tích tài',
    health: 'Hành Thủy, lưu ý thận, bàng quang, hệ sinh sản tiết niệu. Năng lượng tiêu hao nhiều, cần duy trì thể thao điều độ',
  },
};

const levelConfig = {
  major: { label: 'Chính Tinh', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Cát Tinh', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sát Tinh', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'Tạp Tinh', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

const siHuaColors: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>{translateStarName(star.name)}</span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  化{star.siHua}
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* 基本信息 */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Ngũ Hành · ${desc.element}`,
                  `Đặc Tính · ${desc.nature}`,
                  ...(palaceName ? [`Cung Vị · ${palaceName}`] : []),
                  ...(star.brightness ? [star.brightness === 'bright' ? 'Miếu Vượng' : star.brightness === 'dim' ? 'Hãm Địa' : 'Bình Hòa'] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      border: '1px solid var(--t-border)',
                      color: tag.includes('Miếu Vượng') ? '#eab308' : tag.includes('Hãm Địa') ? '#ef4444' : 'var(--t-text2)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* 关键词 */}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>Đặc Tính Tinh Diệu</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Xuất Xứ Cổ Thư */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>
                  古书原文
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{detail.classical}</p>
              </div>
            )}

            {/* 倪海厦解读 */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    Danh Sư Nghê Hải Hà Luận Giải
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Định hướng sự nghiệp', value: detail.career, icon: '◈' },
                    { label: 'Đặc tính tình cảm', value: detail.relationship, icon: '♡' },
                    { label: 'Phân tích tài vận', value: detail.wealth, icon: '◆' },
                    { label: 'Lưu ý sức khỏe', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">Cung vị đắc địa nhất</div>
                    <div className="text-emerald-500/70">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">Cung vị cần lưu ý</div>
                    <div className="text-red-500/70">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* 辅星/煞星说明 */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.type === 'lucky' && (
                  <>
                    {star.name === '文昌' && 'Văn Xương nhập cung: Chủ khoa bảng học vấn hanh thông, văn thư giấy tờ thuận lợi, danh hiển văn chương. Cổ quyết: "Văn Xương khoa giáp, chủ văn chương hiển đạt, thi cử tất đỗ."'}
                    {star.name === '文曲' && 'Văn Khúc nhập cung: Chủ tài hoa xuất chúng, khéo ăn nói, biểu đạt lưu loát, thiên phú nghệ thuật. Cổ quyết: "Văn Khúc vi tài nghệ chi tinh, văn võ song toàn, tài biện hơn người."'}
                    {star.name === '左辅' && 'Tả Phù nhập cung: Chủ quý nhân nâng đỡ, bạn bè tương trợ, gặp hung hóa cát. Cổ quyết: "Tả Phù vi trợ lực chi tinh, tọa mệnh đa quý nhân, phùng hung hóa cát."'}
                    {star.name === '右弼' && 'Hữu Bật nhập cung: Chủ âm trợ tương phùng, phái nữ giúp sức, chuyển nguy thành an. Cổ quyết: "Hữu Bật vi âm trợ chi tinh, đa nữ quý nhân, hóa hiểm vi di."'}
                    {star.name === '天魁' && 'Thiên Khôi nhập cung: Chủ Thiên Ất Quý Nhân (Dương quý nhân), đàn ông đề bạt giúp đỡ, nâng cao vị thế. Cổ quyết: "Thiên Khôi vi Thiên Ất quý nhân, phùng chi tất hữu quý nhân phù trì."'}
                    {star.name === '天钺' && 'Thiên Việt nhập cung: Chủ Ngọc Đường Quý Nhân (Âm quý nhân), nữ nhân tương trợ, gia tăng cát khí.'}
                    {star.name === '禄存' && 'Lộc Tồn nhập cung: Chủ tài lộc dồi dào, tích lũy vững vàng, tiền bạc thịnh vượng bền vững. Cổ quyết: "Lộc Tồn vi tài lộc chi tinh, chủ tích tài hữu dư, nhập tài ổn định."'}
                    {star.name === '天马' && 'Thiên Mã nhập cung: Chủ năng động bôn ba, động trung sinh tài, phát đạt xa xứ. Cổ quyết: "Thiên Mã chủ động, phùng Lộc tất tài lộc song toàn, dịch chuyển sinh tài."'}
                  </>
                )}
                {star.type === 'sha' && (
                  <>
                    {star.name === '地空' && 'Địa Không nhập cung: Chủ tính hư vô, tâm linh ngộ tính, đề phòng tiền bạc hao hụt, tâm tính phân tán. Cổ quyết: "Địa Không chủ hư hao, ngộ Đạo triết học, phòng việc dở dang."'}
                    {star.name === '地劫' && 'Địa Kiếp nhập cung: Chủ tổn hao bất ngờ, làm việc nên cẩn trọng, phòng tiểu nhân tranh chấp. Cổ quyết: "Địa Kiếp chủ kiếp tài, đề phòng phá tài ngoài ý muốn."'}
                    {star.name === '火星' && 'Hỏa Tinh nhập cung: Tính khí nóng nảy, bộc trực; nếu đồng cung ngộ Tham Lang hợp thành "Hỏa Tham Cách" chủ bạo phát tài lộc. Cổ quyết: "Hỏa Tinh ngộ Tham Lang, xưng vi Hỏa Tham cách, chủ cự phú."'}
                    {star.name === '铃星' && 'Linh Tinh nhập cung: Sát khí tiềm tàng, làm việc nên kín kẽ đề phòng thị phi. Ngộ Tham Lang đồng cung thành "Linh Tham Cách" phát phúc dài lâu.'}
                    {star.name === '擎羊' && 'Kình Dương nhập cung: Cương liệt dũng mãnh nhưng hình khắc, đề phòng va chạm xước xát huyết quang. Cổ quyết: "Kình Dương vi hình khắc chi tinh, tính cương quả quyết."'}
                    {star.name === '陀罗' && 'Đà La nhập cung: Chủ ám muội dây dưa, công việc dễ chậm trễ, cần kiên trì nhẫn nại vượt qua. Cổ quyết: "Đà La chủ thị phi trì trệ, sự tình đa ma triền miên."'}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
