"use strict";
var input = document.querySelectorAll('textarea')[0],
	characterCount = document.querySelector('#characterCount'),
	wordCount = document.querySelector('#wordCount'),
	sentenceCount = document.querySelector('#sentenceCount'),
	paragraphCount = document.querySelector('#paragraphCount'),
	readingTime = document.querySelector('#readingTime'),
	keywordsDiv = document.querySelectorAll('.keywords')[0],
	topKeywords = document.querySelector('#topKeywords'),
	infoDiv = document.querySelectorAll(".info")[0];

	// updating the displayed stats after every keypress
	input.addEventListener('keyup', function() {
		
	//keeping the console clean to make only the latest data visible
	console.clear();
	console.log()

	// character count
	// just displaying the input length as everything is a character
	characterCount.innerHTML = input.value.length;

	// word count using \w metacharacter - replacing this with .* to match anything between word boundaries since it was not taking 'a' as a word.
	// this is a masterstroke - to count words with any number of hyphens as one word
	// [-?(\w+)?]+ looks for hyphen and a word (we make both optional with ?). + at the end makes it a repeated pattern
	// \b is word boundary metacharacter
	var words = input.value.match(/\b[-?(\w+)?]+\b/gi);
	if (words) {
		wordCount.innerHTML = words.length;
	} else {
		wordCount.innerHTML = 0;
	}

	// sentence count using ./!/? as sentense separators
	if (words) {
		var sentences = input.value.split(/[.|!|?]+/g);
		console.log(sentences);
		sentenceCount.innerHTML = sentences.length - 1;
	} else {
		sentenceCount.innerHTML = 0;
	}

	// paragraph count from http://stackoverflow.com/a/3336537
	if (words) {
		// \n$ takes care of empty lines: lines with no characters, and only \n are not paragraphs
		// and need to be replaced with empty string
		var paragraphs = input.value.replace(/\n$/gm, '').split(/\n/);
		paragraphCount.innerHTML = paragraphs.length;
	} else {
		paragraphCount.innerHTML = 0;
	}
	// console.log(paragraphs);

	// reading time based on 275 words/minute
	if (words) {
		var seconds = Math.floor(words.length * 60 / 275);
		// need to convert seconds to minutes and hours
		if (seconds > 59) {
			var minutes = Math.floor(seconds / 60);
			seconds = seconds - minutes * 60;
			readingTime.innerHTML = minutes + "m " + seconds + "s";
		} else {
			readingTime.innerHTML = seconds + "s";
		}
	} else {
		readingTime.innerHTML = "0s";
	}

	// finding out top keywords and their count
	// step-1: remove all the stop words
	// step-2: form an object with keywords and their count
	// step-3: sort the object by first converting it to a 2D array
	// step-4: display top 4 keywords and their count

	if (words) {

		// step-1: removing all the stop words
		var nonStopWords = [];
		var stopWords = ['cùng tuổi', 'mỗi một', 'bởi đâu', 'vừa khi', 'trước nhất', 'a lô', 'bỏ ra', 'tăng cấp', 'bất kỳ', 'xa tắp', 'nhận được', 'hay đâu', 'chịu ăn', 'chứ', 'nói phải', 'năm tháng', 'chui cha', 'ái', 'khiến', 'cá nhân', 'dùng làm', 'khó nói', 'cao ráo', 'ở lại', 'là nhiều', 'lên số', 'như trên', 'ấy là', 'nào', 'đến bao giờ', 'được nước', 'ngày qua', 'quan trọng', 'đưa chuyện', 'làm được', 'ra gì', 'tăng thêm', 'do đó', 'gây giống', 'bán dạ', 'á à', 'làm tại', 'sự thế', 'thích ý', 'phải không', 'bác', 'phía', 'giảm', 'cần số', 'nhà làm', 'nhất thì', 'khó nghe', 'quá thì', 'gây cho', 'mọi giờ', 'mỗi lúc', 'tăng chúng', 'có nhiều', 'nói lại', 'cùng', 'xoét', 'lúc đến', 'hãy', 'nhà khó', 'cho đang', 'ông ổng', 'khi trước', 'dữ cách', 'trước', 'cho tin', 'nhất nhất', 'với nhau', 'thế mà', 'từ nay', 'bông', 'nền', 'nhược bằng', 'cây', 'bà', 'quá', 'hỏi xin', 'tạo ý', 'tăng', 'nếu cần', 'nhà ngươi', 'ráo trọi', 'thuộc từ', 'gồm', 'rằng là', 'lâu nay', 'chịu lời', 'nớ', 'phỉ phui', 'nhớ lấy', 'ối giời ơi', 'như tuồng', 'về không', 'quá ư', 'đó', 'đến nỗi', 'chăng chắc', 'cách', 'đưa tay', 'lòng', 'nữa rồi', 'chiếc', 'vẫn', 'nghĩ xa', 'ít biết', 'anh ấy', 'có cơ', 'chành chạnh', 'một ít', 'tăm tắp', 'sao cho', 'đến khi', 'tay quay', 'tại đó', 'ăn trên', 'em em', 'cuối điểm', 'tính từ', 'đây', 'trệu trạo', 'của ngọt', 'để mà', 'vào khoảng', 'ra chơi', 'nhiều ít', 'tránh tình trạng', 'đặc biệt', 'của', 'trong ấy', 'từ ấy', 'rõ thật', 'thếch', 'ào vào', 'khoảng không', 'cần cấp', 'à', 'mới rồi', 'bởi ai', 'xăm xúi', 'ví bằng', 'ở trên', 'nếu như', 'lấy ra', 'trước ngày', 'bạn', 'bản', 'lâu', 'ngay', 'vung tàn tán', 'duy', 'quá lời', 'cả nhà', 'bởi sao', 'làm ngay', 'tạo cơ hội', 'bấy nhiêu', 'buổi làm', 'hay là', 'phải cái', 'thế thường', 'ra bài', 'mọi nơi', 'tới gần', 'đến gần', 'chuyển', 'khó nghĩ', 'khỏi', 'thà là', 'nhất quyết', 'dạ khách', 'tột cùng', 'dữ', 'chớ', 'thấy tháng', 'bỗng', 'thật là', 'đáng lẽ', 'được lời', 'chốc chốc', 'cuộc', 'thật lực', 'tạo ra', 'nhất định', 'qua lại', 'đã hay', 'tốt bộ', 'nước bài', 'từng đơn vị', 'ô hô', 'cây nước', 'nhận biết', 'rày', 'ngọn', 'thuộc cách', 'dễ đâu', 'như thể', 'nên chi', 'trước tiên', 'tại nơi', 'ngay khi', 'bản ý', 'cả ăn', 'chính giữa', 'vừa', 'dạ con', 'nhỏ', 'tất tật', 'cho đến khi', 'thế ra', 'nhờ có', 'vấn đề quan trọng', 'ngồi', 'tắp tắp', 'tốc tả', 'không gì', 'ngay từ', 'đâu đây', 'nói thật', 'úi', 'từng cái', 'riêng', 'tin vào', 'vâng chịu', 'bất kể', 'ví thử', 'lại làm', 'chùn chũn', 'như quả', 'nói toẹt', 'ăn người', 'ngay tức thì', 'ăn hết', 'chưa dễ', 'chưa kể', 'khó tránh', 'bắt đầu từ', 'các', 'nghe như', 'như không', 'đơn vị', 'như thế', 'tự tính', 'không ai', 'xệp', 'tha hồ', 'thuộc lại', 'nhanh lên', 'ờ ờ', 'nước đến', 'nên chăng', 'khác', 'trên dưới', 'muốn', 'tanh tanh', 'tên cái', 'lý do', 'ở vào', 'thường sự', 'nhằm', 'đã đủ', 'dễ ăn', 'chị', 'chỉ chính', 'vì thế', 'biết việc', 'thường khi', 'biết trước', 'đến xem', 'xa', 'tít mù', 'lời chú', 'áng', 'biết đâu chừng', 'dì', 'úi chà', 'bà ấy', 'qua ngày', 'thật sự', 'làm tôi', 'ơi là', 'không có gì', 'không để', 'khác nhau', 'xem ra', 'ra đây', 'đại để', 'hay nhỉ', 'rồi', 'sở dĩ', 'lại nữa', 'quả vậy', 'trời đất ơi', 'phăn phắt', 'được cái', 'đến thế', 'thanh điều kiện', 'nhân tiện', 'tất thảy', 'cho hay', 'nghe rõ', 'ra người', 'chú mày', 'cuốn', 'cao sang', 'cũng thế', 'đã là', 'ồ', 'riu ríu', 'yêu cầu', 'chưa từng', 'a ha', 'xăm xăm', 'bây chừ', 'sất', 'vào lúc', 'đủ', 'ngồi bệt', 'từng', 'nào phải', 'như ai', 'nữa khi', 'nhưng mà', 'vô vàn', 'như trước', 'làm tắp lự', 'nấy', 'tất tần tật', 'khó làm', 'xuất hiện', 'thường thôi', 'hoàn toàn', 'cách đều', 'đặt mức', 'mở', 'quay số', 'người hỏi', 'trước hết', 'vài nhà', 'cuối cùng', 'nếu mà', 'nhìn', 'vì rằng', 'trong vùng', 'hay', 'tốt bạn', 'cha', 'trong số', 'bấy giờ', 'cả năm', 'ra điều', 'cơ dẫn', 'thuộc', 'tại lòng', 'làm ra', 'lượng', 'tên', 'ít có', 'duy chỉ', 'bất thình lình', 'nói chung', 'suýt nữa', 'ăn', 'làm như', 'nói', 'mỗi người', 'nhận thấy', 'cụ thể', 'chu cha', 'chơi', 'vâng', 'tự ăn', 'cách bức', 'thì giờ', 'luôn cả', 'đến nơi', 'lấy', 'nếu', 'chuyện', 'nhớ lại', 'trước khi', 'phần sau', 'thúng thắng', 'xin', 'tập trung', 'về sau', 'đặt để', 'làm nên', 'chớ chi', 'căn cắt', 'là thế nào', 'lên nước', 'xoành xoạch', 'số là', 'bởi tại', 'ba cùng', 'số', 'lượng cả', 'cao thế', 'cu cậu', 'bài bỏ', 'lấy có', 'gì đó', 'để lòng', 'biết thế', 'khi', 'thế thế', 'thực ra', 'tuốt tuồn tuột', 'bỏ lại', 'chắc người', 'ắt là', 'bất cứ', 'vả lại', 'dù dì', 'dù sao', 'cấp trực tiếp', 'đồng thời', 'cũng được', 'phỏng', 'cho đến nỗi', 'từ tại', 'số cụ thể', 'về phần', 'giống như', 'nước ăn', 'chơi họ', 'ra tay', 'ráo nước', 'đặt', 'cho tới', 'xa nhà', 'biết được', 'ăn ngồi', 'sao', 'chứ lị', 'bất tử', 'bởi vậy', 'nhờ nhờ', 'ăn tay', 'rồi thì', 'mỗi', 'khó thấy', 'khá', 'ngày ngày', 'phè', 'bển', 'đúng với', 'có', 'phải lại', 'bây nhiêu', 'oái', 'tên họ', 'ôi chao', 'đều nhau', 'rất', 'thốc tháo', 'bay biến', 'thậm chí', 'biết mấy', 'nhờ đó', 'lượng số', 'nghe không', 'do', 'hay hay', 'biết chắc', 'ba ngày', 'rất lâu', 'gặp phải', 'qua đi', 'đầy', 'thật quả', 'lấy giống', 'càng càng', 'ở đây', 'riệt', 'tuy có', 'những lúc', 'tọt', 'trong ngoài', 'ối dào', 'mà', 'thế chuẩn bị', 'giống nhau', 'vài nơi', 'vâng vâng', 'việc', 'nhìn xuống', 'úi dào', 'ăn hỏi', 'hay biết', 'đến thì', 'cấp số', 'lấy thêm', 'sau sau', 'như vậy', 'lại còn', 'tại sao', 'cô mình', 'cả thể', 'bên cạnh', 'tính phỏng', 'sau nữa', 'điểm đầu tiên', 'cảm thấy', 'chung cho', 'chứ ai', 'thường đến', 'không bao lâu', 'càng', 'phần nhiều', 'để được', 'nói riêng', 'còn', 'chúng tôi', 'tìm bạn', 'tối ư', 'căn', 'giống', 'lại nói', 'nói bông', 'ở nhờ', 'sáng ý', 'vâng ý', 'quan tâm', 'mợ', 'ngay bây giờ', 'vùng', 'xa xa', 'đại nhân', 'dầu sao', 'mang về', 'là là', 'vừa qua', 'qua thì', 'ủa', 'đã lâu', 'mang', 'rằng', 'từng thời gian', 'bởi thế', 'xin gặp', 'ngay lập tức', 'lớn', 'lấy sau', 'thời gian sử dụng', 'thời điểm', 'xảy ra', 'nên làm', 'làm lại', 'khác khác', 'có điều kiện', 'bởi', 'tháng năm', 'lại giống', 'một cơn', 'nhớ', 'thuộc bài', 'ngay tức khắc', 'trả trước', 'cả ngày', 'lại', 'thốt nói', 'giữ lấy', 'luôn tay', 'tháng tháng', 'tênh tênh', 'tuốt luốt', 'ông', 'tất cả bao nhiêu', 'lời nói', 'đã thế', 'do vì', 'trước tuổi', 'vung tán tàn', 'chung qui', 'bỏ mẹ', 'tới', 'quả là', 'thấp xuống', 'cảm ơn', 'có tháng', 'quan trọng vấn đề', 'lần nào', 'xa cách', 'vị tất', 'hỏi xem', 'dành', 'vào vùng', 'hơn hết', 'hết chuyện', 'đưa cho', 'hỗ trợ', 'sớm', 'đạt', 'phải giờ', 'bây giờ', 'gần xa', 'dù cho', 'nghe ra', 'tìm việc', 'chết nỗi', 'ba tăng', 'được tin', 'cho rằng', 'hoặc là', 'cô quả', 'tuyệt nhiên', 'vô luận', 'lúc sáng', 'để giống', 'như sau', 'giống người', 'lúc đi', 'xuống', 'cơ cùng', 'cùng chung', 'dễ khiến', 'buổi', 'phải như', 'chú dẫn', 'lúc', 'để cho', 'bấy lâu nay', 'vậy ư', 'nhìn chung', 'lại quả', 'thộc', 'lần sau', 'công nhiên', 'trong khi', 'trếu tráo', 'chầm chập', 'tức tốc', 'nhỡ ra', 'nói với', 'tiếp theo', 'các cậu', 'đủ điểm', 'đưa ra', 'ráo cả', 'đại phàm', 'nữa', 'thím', 'vấn đề', 'ngày đến', 'thanh không', 'khó biết', 'kể như', 'nhìn theo', 'đưa em', 'nếu không', 'thêm vào', 'dùng hết', 'quay lại', 'bập bà bập bõm', 'mở ra', 'khi nào', 'lại ăn', 'thường tính', 'thấp cơ', 'tên tự', 'vì chưng', 'chưa tính', 'cơ', 'nhiên hậu', 'đối với', 'thảo nào', 'ô kê', 'đáng kể', 'nhận họ', 'bỏ mất', 'nhớ bập bõm', 'nói xa', 'chỉ tên', 'từ tính', 'tốt hơn', 'hầu hết', 'không được', 'tìm cách', 'tính cách', 'chưa dùng', 'đặt làm', 'cho thấy', 'ra vào', 'nên người', 'thật ra', 'bất quá chỉ', 'có được', 'buổi ngày', 'thêm', 'ví phỏng', 'cơ hồ', 'bức', 'vượt quá', 'sau cùng', 'trỏng', 'ngày càng', 'hay tin', 'vào đến', 'nếu vậy', 'giảm thế', 'chịu', 'thoạt nhiên', 'ngay lúc', 'hết cả', 'rồi sau', 'sao vậy', 'thêm chuyện', 'chú khách', 'điểm chính', 'có đâu', 'ối giời', 'vạn nhất', 'giờ đi', 'tông tốc', 'bỗng thấy', 'quay bước', 'phía trong', 'thì ra', 'dù rằng', 'như nhau', 'làm mất', 'nặng về', 'nói trước', 'vậy mà', 'thuần ái', 'vở', 'dạ bán', 'nói rõ', 'tuốt tuột', 'chắc ăn', 'theo', 'đã', 'ngày tháng', 'dùng', 'từng giờ', 'nơi', 'không', 'chùn chùn', 'xuất kỳ bất ý', 'trong này', 'nào là', 'chưa có', 'từ thế', 'nghỉm', 'không có', 'tù tì', 'ba bản', 'nghe thấy', 'chao ôi', 'làm vì', 'chưa', 'chợt nhìn', 'ư', 'thanh', 'mọi thứ', 'trực tiếp', 'nhất loạt', 'không cùng', 'là phải', 'đến điều', 'rồi tay', 'tha hồ chơi', 'còn nữa', 'gặp', 'bỏ cuộc', 'chú mình', 'phải rồi', 'loại', 'tiện thể', 'năm', 'tại đây', 'lại bộ', 'đó đây', 'trả lại', 'ngay cả', 'khó khăn', 'nữa là', 'kể tới', 'mọi sự', 'từ ái', 'vượt', 'mà thôi', 'từng ấy', 'chọn', 'tắp', 'thực hiện', 'tạo nên', 'sớm ngày', 'làm đúng', 'sao đang', 'tại tôi', 'vài điều', 'ít', 'có điều', 'so với', 'do vậy', 'ra lời', 'răng', 'nghe', 'đến tuổi', 'ông tạo', 'dùng đến', 'vô hình trung', 'bấy', 'để không', 'quá giờ', 'sắp đặt', 'theo bước', 'à ơi', 'cơ chừng', 'bài', 'trong mình', 'bước', 'cả thảy', 'một số', 'xử lý', 'ồ ồ', 'nghe lại', 'răng răng', 'cho rồi', 'chung cục', 'không tính', 'gần bên', 'phỏng theo', 'dở chừng', 'ít ra', 'lần trước', 'sau đây', 'mọi lúc', 'họ xa', 'nghe chừng', 'lấy được', 'được', 'vừa mới', 'rồi sao', 'tự vì', 'về nước', 'cùng với', 'dài ra', 'ông từ', 'ổng', 'bấy chừ', 'ngày xửa', 'ra ý', 'nay', 'nhận làm', 'đánh giá', 'cả nghĩ', 'nhận ra', 'bằng nấy', 'tự khi', 'tênh', 'làm lấy', 'khá tốt', 'ngồi không', 'đến giờ', 'buổi mới', 'lấy lại', 'tạo', 'lần này', 'làm theo', 'hơn nữa', 'nước', 'nghen', 'hơn là', 'chưa cần', 'mỗi ngày', 'tên chính', 'ừ nhé', 'cái ấy', 'thì là', 'chắc vào', 'dễ thường', 'ắt phải', 'thường hay', 'ra lại', 'oai oái', 'tuổi cả', 'hay không', 'ra sao', 'cả người', 'nói đủ', 'ớ này', 'ừ ừ', 'trển', 'nghĩ ra', 'lúc này', 'chung quy', 'một lúc', 'hiện nay', 'thường bị', 'chuyển đạt', 'tại vì', 'chung', 'chứ như', 'bao giờ', 'có chăng là', 'chung ái', 'sang năm', 'biết chừng nào', 'cùng cực', 'cật lực', 'nguồn', 'ăn làm', 'có phải', 'đáo để', 'gần', 'bất giác', 'chứ sao', 'ngôi thứ', 'khác thường', 'chọn bên', 'vài người', 'giờ', 'vài', 'này nọ', 'tránh xa', 'vậy thì', 'nước nặng', 'trên bộ', 'chưa bao giờ', 'thậm từ', 'đến hay', 'cơ hội', 'cách không', 'qua chuyện', 'đâu cũng', 'thường số', 'bị chú', 'họ gần', 'không đầy', 'ngày ấy', 'nhằm vào', 'thường xuất hiện', 'khác gì', 'cao xa', 'tay', 'thoắt', 'dạ', 'chậc', 'cơn', 'cho nhau', 'bản bộ', 'coi bộ', 'ăn chắc', 'vừa rồi', 'nặng mình', 'gì', 'thẩy', 'chợt', 'đúng ngày', 'thuần', 'ăn riêng', 'nhằm lúc', 'ừ thì', 'thứ', 'lên mạnh', 'trở thành', 'tuổi tôi', 'cứ như', 'mối', 'ô kìa', 'nhất đán', 'vì vậy', 'nghe nhìn', 'ngộ nhỡ', 'có chuyện', 'đáng lý', 'nào cũng', 'dùng cho', 'phần việc', 'bỗng không', 'ba họ', 'ngôi', 'nếu có', 'cho được', 'nặng', 'thiếu điểm', 'chứ gì', 'ít nữa', 'mất còn', 'tuy đã', 'xuất kì bất ý', 'luôn luôn', 'nhằm để', 'nếu được', 'ôi thôi', 'thế thì', 'biết đâu đấy', 'vào gặp', 'xuể', 'chính là', 'ắt', 'khó', 'tôi', 'nhau', 'cái', 'người người', 'chúng', 'sốt sột', 'trả', 'nhỏ người', 'chủn', 'gây ra', 'tiếp tục', 'thảo hèn', 'ngõ hầu', 'phía trước', 'ạ ơi', 'nghe được', 'cả', 'dẫu mà', 'chung quy lại', 'nhân dịp', 'thì phải', 'hiện tại', 'xem', 'khi khác', 'đến', 'thiếu', 'không dùng', 'chớ gì', 'nói thêm', 'cho đến', 'luôn', 'cao lâu', 'hãy còn', 'có ai', 'vậy nên', 'lấy làm', 'ở đó', 'cả đến', 'nói lên', 'trước đây', 'sẽ hay', 'nhanh tay', 'trước kia', 'không phải', 'bởi chưng', 'bước khỏi', 'hết nói', 'mọi người', 'với lại', 'số người', 'cha chả', 'ngoài', 'lại thôi', 'thục mạng', 'của tin', 'ngày cấp', 'tới thì', 'nhất tề', 'ai nấy', 'tới nơi', 'tới mức', 'chuẩn bị', 'đưa vào', 'đến cùng cực', 'nhón nhén', 'xa gần', 'bỏ mình', 'tò te', 'sa sả', 'thỏm', 'chớ như', 'có ý', 'có khi', 'dễ', 'thôi', 'bởi nhưng', 'thậm cấp', 'tại', 'sao bản', 'nhà ngoài', 'thốt nhiên', 'theo như', 'lên cơn', 'giữa', 'nước lên', 'bán cấp', 'ăn sáng', 'thường thường', 'tự lượng', 'nhìn thấy', 'chỉ là', 'trả ngay', 'gần đến', 'vốn dĩ', 'thành ra', 'xon xón', 'bên', 'bỗng dưng', 'ra', 'xềnh xệch', 'quá nhiều', 'biết mình', 'bị', 'phỏng nước', 'bị vì', 'có ngày', 'điều kiện', 'tốt', 'bằng không', 'nhóm', 'bản thân', 'là ít', 'bất kì', 'như thường', 'thái quá', 'ăn cuộc', 'dưới nước', 'rứa', 'anh', 'rồi ra', 'phía trên', 'thế lại', 'veo', 'dễ như chơi', 'sẽ biết', 'buổi sớm', 'dù gì', 'đều đều', 'bỏ riêng', 'nhưng', 'cần', 'đáng lí', 'ông ấy', 'ơ', 'còn về', 'thương ôi', 'phỏng tính', 'từ', 'nhờ', 'quá tay', 'con', 'xiết bao', 'nghe tin', 'tôi con', 'bỏ', 'tuy là', 'xem lại', 'chẳng lẽ', 'nghĩ tới', 'nhờ chuyển', 'vùng lên', 'cùng nhau', 'nên', 'tuy thế', 'rén bước', 'đảm bảo', 'ý', 'bắt đầu', 'thật chắc', 'hỏi', 'chị ấy', 'thi thoảng', 'kể', 'cổ lai', 'đến đâu', 'lần tìm', 'lần', 'có thế', 'lấy để', 'tuy vậy', 'con con', 'những như', 'làm dần dần', 'đến lúc', 'ăn về', 'giá trị', 'làm', 'cả nghe', 'bỏ nhỏ', 'chăng', 'gì gì', 'lâu các', 'hay nói', 'từ từ', 'một', 'phốc', 'thanh thanh', 'sắp', 'nói là', 'qua', 'lần khác', 'quá tin', 'ba ba', 'bất chợt', 'mạnh', 'không bao giờ', 'điểm', 'đủ nơi', 'vô kể', 'bội phần', 'chắc dạ', 'cấp', 'quay đi', 'thế nào', 'chết thật', 'tình trạng', 'nhận việc', 'thích thuộc', 'mang mang', 'về tay', 'ái chà', 'để phần', 'em', 'chung chung', 'rồi xem', 'giảm chính', 'thế à', 'bỏ bà', 'nhất là', 'chưa chắc', 'cũng nên', 'kể từ', 'để', 'bớ', 'ba ngôi', 'nó', 'người nhận', 'bước đi', 'chúng mình', 'người nghe', 'phắt', 'đành đạch', 'nghiễm nhiên', 'đến lời', 'nhà việc', 'chính thị', 'sau đó', 'bằng như', 'ừ', 'làm tăng', 'nhất luật', 'dẫn', 'phỏng như', 'khoảng cách', 'phía bạn', 'đại loại', 'cơ chỉ', 'nhất sinh', 'phải khi', 'giảm thấp', 'trực tiếp làm', 'nhà tôi', 'choa', 'không bán', 'văng tê', 'đánh đùng', 'thế là', 'sáng rõ', 'dễ sử dụng', 'bằng người', 'liên quan', 'giữ', 'vị trí', 'để đến nỗi', 'phè phè', 'tốt mối', 'lấy lý do', 'chắc lòng', 'thích tự', 'nhất mực', 'chúng ông', 'nói qua', 'đầy năm', 'có đáng', 'làm sao', 'đâu như', 'cậu', 'sau này', 'đây rồi', 'hết ráo', 'thích cứ', 'cụ thể là', 'dài', 'phụt', 'điểm gặp', 'kể cả', 'tránh', 'cao răng', 'ừ ào', 'trong đó', 'chớ không', 'chung nhau', 'nói ý', 'không những', 'nhiệt liệt', 'vậy ra', 'làm thế nào', 'cái đã', 'tắp lự', 'quá trình', 'từ căn', 'thêm giờ', 'ở', 'ái dà', 'lớn nhỏ', 'tiếp đó', 'là', 'nhà chung', 'thanh ba', 'so', 'đặt mình', 'thật', 'nói ra', 'mở mang', 'chia sẻ', 'như chơi', 'không thể', 'lúc ấy', 'không còn', 'lượng từ', 'ít nhất', 'ít lâu', 'suýt', 'thanh chuyển', 'từ giờ', 'nhỉ', 'với', 'bằng nhau', 'lúc đó', 'phía bên', 'dẫu rằng', 'trừ phi', 'làm bằng', 'tà tà', 'vẫn thế', 'giờ này', 'thốc', 'ngươi', 'ít nhiều', 'lần sang', 'làm cho', 'vụt', 'mang nặng', 'phải biết', 'thấp', 'tin thêm', 'vài ba', 'việc gì', 'ở được', 'nhà', 'ờ', 'tấm các', 'ngọn nguồn', 'thấp thỏm', 'nơi nơi', 'ren rén', 'bởi vì', 'đáng số', 'số cho biết', 'lại người', 'mọi', 'bao lâu', 'mọi việc', 'ứ hự', 'thường tại', 'có họ', 'cuối', 'cũng như', 'nhìn nhận', 'phải chăng', 'hơn trước', 'tuy', 'sự việc', 'béng', 'từ điều', 'khi nên', 'ngày', 'tức thì', 'hơn', 'chú', 'dễ ngươi', 'bỗng nhiên', 'cực lực', 'hết của', 'áng như', 'mà cả', 'chẳng những', 'chỉ có', 'nhất', 'không cần', 'thế', 'vèo', 'chứ không phải', 'nào đó', 'rồi đây', 'nghe nói', 'ra ngôi', 'khi không', 'rõ là', 'ví dù', 'chứ lại', 'ít khi', 'lúc khác', 'dào', 'ít quá', 'trước nay', 'vậy', 'chính bản', 'ấy', 'bệt', 'bất đồ', 'sì', 'không khỏi', 'tớ', 'ngồi trệt', 'tốt ngày', 'lớn lên', 'cho biết', 'rồi nữa', 'tuần tự', 'rốt cục', 'tự ý', 'veo veo', 'bên bị', 'dễ sợ', 'những là', 'ăn chung', 'cụ thể như', 'giờ đến', 'tin', 'chung cuộc', 'loại từ', 'bằng ấy', 'tựu trung', 'có số', 'những ai', 'đưa tin', 'ai đó', 'đưa', 'người khách', 'bằng được', 'cho chắc', 'sáng ngày', 'nhung nhăng', 'đầy tuổi', 'duy có', 'sao bằng', 'thế thôi', 'mới hay', 'nếu thế', 'ngoải', 'hay sao', 'đây đó', 'lấy vào', 'ơi', 'còn như', 'phải người', 'bỗng đâu', 'đúng ra', 'hơn cả', 'nhanh', 'ngoài này', 'mà không', 'nhận nhau', 'xoẹt', 'dễ thấy', 'có vẻ', 'quả thế', 'tấn tới', 'ngọt', 'bấy chầy', 'quá đáng', 'phải tay', 'ngày rày', 'tỏ ra', 'đây này', 'chịu tốt', 'có chăng', 'cái đó', 'càng hay', 'tuy nhiên', 'đủ dùng', 'nhớ ra', 'lấy thế', 'đặt ra', 'lâu ngày', 'ở năm', 'chị bộ', 'bèn', 'chứ còn', 'dưới', 'thực tế', 'vung thiên địa', 'gần hết', 'xa xả', 'biết', 'dẫu', 'chịu chưa', 'rõ', 'đang tay', 'ăn chịu', 'tự', 'rút cục', 'vùng nước', 'nặng căn', 'nhiều', 'cứ việc', 'ngăn ngắt', 'là cùng', 'thời gian', 'cao số', 'cho tới khi', 'tột', 'có người', 'con nhà', 'sang', 'tuổi', 'đặt trước', 'lúc nào', 'khoảng', 'phần', 'đã không', 'thì thôi', 'lên xuống', 'làm tin', 'amen', 'số phần', 'ai', 'vừa vừa', 'cật sức', 'phải', 'ngày xưa', 'mà vẫn', 'song le', 'giữa lúc', 'dễ dùng', 'thay đổi', 'lại cái', 'nghĩ', 'ngày này', 'lấy số', 'điều gì', 'từ khi', 'vài tên', 'có ăn', 'chứ không', 'có dễ', 'bất luận', 'ạ', 'không hay', 'cho ăn', 'nhìn lại', 'tanh', 'phải lời', 'bỗng nhưng', 'chăng nữa', 'làm riêng', 'mức', 'điều', 'ào', 'lại đây', 'đầu tiên', 'biết bao', 'cứ điểm', 'mở nước', 'bao nhiêu', 'nghe hiểu', 'bằng', 'gần ngày', 'giờ lâu', 'nước cùng', 'trong', 'thốt thôi', 'phần nào', 'bán', 'cái gì', 'tự tạo', 'sáng thế', 'đến cùng', 'những khi', 'lên cao', 'sang tay', 'như', 'không cứ', 'bản riêng', 'không điều kiện', 'nước xuống', 'cùng ăn', 'nóc', 'chết tiệt', 'có chứ', 'ầu ơ', 'bỏ không', 'không biết', 'đưa về', 'bấy lâu', 'qua tay', 'chớ kể', 'để lại', 'thực vậy', 'tạo điều kiện', 'à này', 'từ đó', 'qua khỏi', 'tăng giảm', 'dạ dạ', 'quá bộ', 'chẳng phải', 'á', 'dẫu sao', 'dạ dài', 'gặp khó khăn', 'không phải không', 'đưa đến', 'họ', 'lên đến', 'chắc chắn', 'riêng từng', 'thỉnh thoảng', 'tại đâu', 'phương chi', 'ngôi nhà', 'ít thôi', 'bộ điều', 'và', 'chăn chắn', 'tấn', 'chợt nghe', 'nói tốt', 'khách', 'đang thì', 'có nhà', 'lời', 'ơ hay', 'lên ngôi', 'tấm bản', 'vừa lúc', 'bộ thuộc', 'như ý', 'ứ ừ', 'rón rén', 'không nhận', 'bỏ việc', 'thoạt nghe', 'chắc', 'đang', 'ba', 'chọn ra', 'số thiếu', 'ngay lúc này', 'đâu có', 'rốt cuộc', 'bước tới', 'đã vậy', 'khó chơi', 'tính căn', 'mới đây', 'về', 'vèo vèo', 'bỏ cha', 'nhất tâm', 'lần lần', 'đâu nào', 'những', 'mình', 'cũng vậy', 'đủ số', 'người khác', 'hay làm', 'thứ đến', 'ít thấy', 'tỏ vẻ', 'cũng', 'chuyển tự', 'đầy phè', 'ào ào', 'dài lời', 'ngày nọ', 'nhé', 'thời gian tính', 'mất', 'tháng ngày', 'sau cuối', 'nào hay', 'nào đâu', 'một vài', 'hỏi lại', 'hiểu', 'một cách', 'trong lúc', 'bỏ xa', 'trước đó', 'coi mòi', 'đến ngày', 'hết rồi', 'nói nhỏ', 'toẹt', 'quận', 'đúng tuổi', 'đều bước', 'cả tin', 'xăm xắm', 'thiếu gì', 'phía sau', 'dễ gì', 'tấm', 'bộ', 'tất cả', 'trước sau', 'một khi', 'khác nào', 'lúc trước', 'làm gì', 'biết bao nhiêu', 'căn tính', 'trả của', 'vào', 'quả thật', 'bên có', 'bập bõm', 'đến nay', 'thường', 'nhất thiết', 'than ôi', 'chỉ', 'cùng tột', 'phù hợp', 'thích', 'nghĩ lại', 'thay đổi tình trạng', 'thứ bản', 'quay', 'lấy xuống', 'xin vâng', 'bài cái', 'âu là', 'từng phần', 'ử', 'thình lình', 'người mình', 'mỗi lần', 'lâu lâu', 'thà', 'đâu đó', 'không chỉ', 'bởi thế cho nên', 'lúc lâu', 'phứt', 'vì', 'thà rằng', 'ngay thật', 'thế nên', 'sau hết', 'xa tanh', 'gần như', 'cho', 'nghe đâu như', 'mới', 'cô ấy', 'không kể', 'cơ mà', 'biết đâu', 'hết ý', 'phía dưới', 'thanh điểm', 'theo tin', 'tự cao', 'phóc', 'phần lớn', 'ít hơn', 'gần đây', 'ắt thật', 'bấy nay', 'cô', 'ông nhỏ', 'ngày nào', 'ý chừng', 'ăn quá', 'quả', 'nên tránh', 'thoạt', 'những muốn', 'ơ kìa', 'ắt hẳn', 'vậy là', 'quá tuổi', 'mà lại', 'đưa tới', 'đáng', 'bất quá', 'thế sự', 'đúng', 'hết', 'alô', 'ngày giờ', 'này', 'vì sao', 'bất ngờ', 'còn thời gian', 'bây bẩy', 'đâu đâu', 'chắc hẳn', 'gây thêm', 'quá bán', 'như thế nào', 'ý hoặc', 'tìm hiểu', 'thế đó', 'dần dà', 'khỏi nói', 'đều', 'phải chi', 'thật thà', 'bằng cứ', 'chính điểm', 'khó mở', 'chúng ta', 'nhận', 'cao', 'quá mức', 'đâu phải', 'chí chết', 'phải cách', 'không ngoài', 'tuy rằng', 'thành thử', 'chính', 'nọ', 'dù', 'đủ điều', 'cứ', 'cóc khô', 'tha hồ ăn', 'khác xa', 'chỉn', 'ngoài ra', 'sì sì', 'nói khó', 'sang sáng', 'đâu', 'nhằm khi', 'bằng vào', 'đưa xuống', 'qua lần', 'tránh ra', 'nghĩ đến', 'sự', 'thật tốt', 'cho về', 'tăng thế', 'thửa', 'ớ', 'thật vậy', 'thậm', 'ai ai', 'bao nả', 'cần gì', 'tránh khỏi', 'xem số', 'bỗng chốc', 'cũng vậy thôi', 'ý da', 'giá trị thực tế', 'thực sự', 'con tính', 'toà', 'ra bộ', 'rích', 'nước quả', 'sẽ', 'làm lòng', 'bằng nào', 'số loại', 'tính', 'cách nhau', 'thấy', 'vâng dạ', 'chẳng nữa', 'là vì', 'cho nên', 'lấy cả', 'vả chăng', 'như là', 'nức nở', 'toé khói', 'dần dần', 'tính người', 'thôi việc', 'gây', 'sau', 'có thể', 'cái họ', 'ráo', 'nghe đâu', 'khẳng định', 'ngồi sau', 'hoặc', 'tháng', 'bán thế', 'dành dành', 'giữ ý', 'sáng', 'trên', 'bất nhược', 'giờ đây', 'cô tăng', 'căn cái', 'tìm', 'từ loại', 'lên', 'trệt', 'đến cả', 'lần theo', 'cao thấp', 'lòng không', 'thốt', 'sử dụng', 'ngay khi đến', 'ngoài xa', 'tìm ra', 'rén', 'câu hỏi', 'từng nhà', 'con dạ', 'xoẳn', 'lấy ráo', 'thanh tính', 'thì', 'mọi khi', 'nói đến', 'pho', 'nghe trực tiếp', 'phót', 'bỏ quá', 'người', 'dễ nghe', 'sau chót', 'ô hay', 'thực hiện đúng', 'ở như', 'bài bác', 'mang lại', 'vượt khỏi'];

		for (var i = 0; i < words.length; i++) {
			// filtering out stop words and numbers
			if (stopWords.indexOf(words[i].toLowerCase()) === -1 && isNaN(words[i])) {
				nonStopWords.push(words[i].toLowerCase());
			}
		}
		
		// console.log(nonStopWords);

		// step-2: forming an object with keywords and their count
		var keywords = {};
		for (var i = 0; i < nonStopWords.length; i++) {
			// checking if the word(property) already exists
			// if it does increment the count otherwise set it to one
			if (nonStopWords[i] in keywords) {
				keywords[nonStopWords[i]] += 1;
			} else {
				keywords[nonStopWords[i]] = 1;
			}
		}

		// step-3: sorting the object by first converting it to a 2D array
		var sortedKeywords = [];
		for (var keyword in keywords) {
			sortedKeywords.push([keyword, keywords[keyword]])
		}
		sortedKeywords.sort(function(a, b) {
			return b[1] - a[1]
		});
		// console.log(sortedKeywords);

		// step-4: displaying top 4 keywords and their count
		topKeywords.innerHTML = "";
		for (var i = 0; i < sortedKeywords.length; i++) {
			if (sortedKeywords[i][1] >= 20) {
				var li = document.createElement('li');
				li.classList.add("items");
				if (screen.width > 500){
					li.innerHTML = "<b>" + '➤ ' + sortedKeywords[i][0] + "</b>: " + sortedKeywords[i][1];
				} else {
					li.innerHTML = "<b>" + sortedKeywords[i][0] + "</b>: " + sortedKeywords[i][1];
				}
				topKeywords.style.opacity = "1";
				topKeywords.appendChild(li);
				
			}
		}
		if ($(".items").length >= 1){
			$(".keywords").delay(300).fadeIn();
			infoDiv.classList.add("active");
		} else {
			$(".keywords").delay(0).fadeOut(100);
			infoDiv.classList.remove("active");
		}
	} else {
		$(".keywords").delay(0).fadeOut(100);
		infoDiv.classList.remove("active");
		// topKeywords.style.opacity = "0";
		topKeywords.innerHTML = "";
	}
	
});
							
							// function to convert FLESCH READING SCORE into meaningful string.
							// function readingEase(num) {
								//   switch (true) {
									//     case (num <= 30):
		//       return "Readability: College graduate.";
//       break;
//     case (num > 30 && num <= 50):
//       return "Readability: College level.";
//       break;
//     case (num > 50 && num <= 60):
//       return "Readability: 10th - 12th grade.";
//       break;
//     case (num > 60 && num <= 70):
//       return "Readability: 8th - 9th grade.";
//       break;
//     case (num > 70 && num <= 80):
//       return "Readability: 7th grade.";
//       break;
//     case (num > 80 && num <= 90):
//       return "Readability: 6th grade.";
//       break;
//     case (num > 90 && num <= 100):
//       return "Readability: 5th grade.";
//       break;
//     default:
//       return "Not available.";
//       break;
//   }
// }
