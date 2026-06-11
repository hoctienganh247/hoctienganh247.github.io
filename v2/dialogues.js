// Học Tiếng Anh — Hội thoại mẫu theo chủ đề (dữ liệu cho bài tập "Hội thoại")
// Thứ tự 21 bài KHỚP đúng thứ tự 21 chủ đề trong data.js (index = currentDay - 1).
// Mỗi bài: { lines: [{ s:"A"|"B", en, vi }], vocab: "..." }

const DIALOGUES = [
  // 1. Màu sắc (Colours)
  {
    lines: [
      { s: "A", en: "Hello! What colour is this?", vi: "Xin chào! Đây là màu gì?" },
      { s: "B", en: "It's red.", vi: "Màu đỏ." },
      { s: "A", en: "And this one?", vi: "Còn cái này?" },
      { s: "B", en: "It's blue. I like blue.", vi: "Màu xanh dương. Tớ thích màu xanh dương." },
      { s: "A", en: "Look! A rainbow!", vi: "Nhìn kìa! Một cầu vồng!" },
      { s: "B", en: "Wow! It's so colourful!", vi: "Ồ! Nhiều màu sắc quá!" },
    ],
    vocab: "red, blue, rainbow, colourful",
  },
  // 2. Động vật (Animals)
  {
    lines: [
      { s: "A", en: "What's your favourite animal?", vi: "Con vật yêu thích của bạn là gì?" },
      { s: "B", en: "I like the cat. It's cute.", vi: "Tớ thích con mèo. Nó dễ thương." },
      { s: "A", en: "I like the lion. It's strong.", vi: "Tớ thích con sư tử. Nó khỏe." },
      { s: "B", en: "Look at that elephant!", vi: "Nhìn con voi kìa!" },
      { s: "A", en: "It's big. And the monkey is funny.", vi: "Nó to. Còn con khỉ thì buồn cười." },
      { s: "B", en: "Yes! I love the zoo.", vi: "Đúng! Tớ thích sở thú." },
    ],
    vocab: "cat, lion, elephant, monkey",
  },
  // 3. Đồ chơi (Toys)
  {
    lines: [
      { s: "A", en: "Is this your ball?", vi: "Đây là quả bóng của bạn à?" },
      { s: "B", en: "Yes, it is. I have a teddy bear too.", vi: "Đúng vậy. Tớ còn có một con gấu bông nữa." },
      { s: "A", en: "Can I play with the robot?", vi: "Tớ chơi với người máy được không?" },
      { s: "B", en: "Of course! Here you are.", vi: "Tất nhiên rồi! Của bạn đây." },
      { s: "A", en: "Let's fly the kite!", vi: "Mình thả diều đi!" },
      { s: "B", en: "Great idea!", vi: "Ý hay đấy!" },
    ],
    vocab: "ball, teddy bear, robot, kite",
  },
  // 4. Trường học (School)
  {
    lines: [
      { s: "A", en: "Is this our classroom?", vi: "Đây là phòng học của chúng ta à?" },
      { s: "B", en: "Yes. The teacher is over there.", vi: "Ừ. Giáo viên ở đằng kia." },
      { s: "A", en: "Where is the library?", vi: "Thư viện ở đâu?" },
      { s: "B", en: "It's near the playground.", vi: "Nó ở gần sân chơi." },
      { s: "A", en: "Do we have homework today?", vi: "Hôm nay mình có bài tập về nhà không?" },
      { s: "B", en: "Yes, a little.", vi: "Có, một ít thôi." },
    ],
    vocab: "classroom, teacher, library, playground, homework",
  },
  // 5. Gia đình (Family)
  {
    lines: [
      { s: "A", en: "Is this your family?", vi: "Đây là gia đình bạn à?" },
      { s: "B", en: "Yes. This is my father and my mother.", vi: "Đúng. Đây là bố và mẹ tớ." },
      { s: "A", en: "Do you have a brother?", vi: "Bạn có anh trai không?" },
      { s: "B", en: "Yes, and a little sister too.", vi: "Có, và một em gái nhỏ nữa." },
      { s: "A", en: "Who is that?", vi: "Đó là ai vậy?" },
      { s: "B", en: "That's my grandmother. I love her.", vi: "Đó là bà tớ. Tớ yêu bà." },
    ],
    vocab: "family, father, mother, brother, sister, grandmother",
  },
  // 6. Hình cơ bản (Shapes)
  {
    lines: [
      { s: "A", en: "What shape is the sun?", vi: "Mặt trời có hình gì?" },
      { s: "B", en: "It's a circle.", vi: "Hình tròn." },
      { s: "A", en: "And the window?", vi: "Còn cửa sổ?" },
      { s: "B", en: "It's a square.", vi: "Hình vuông." },
      { s: "A", en: "I can draw a star and a heart.", vi: "Tớ vẽ được ngôi sao và trái tim." },
      { s: "B", en: "Wow, they're beautiful!", vi: "Ồ, đẹp quá!" },
    ],
    vocab: "circle, square, star, heart",
  },
  // 7. Địa điểm (Places)
  {
    lines: [
      { s: "A", en: "Where are you going?", vi: "Bạn đang đi đâu vậy?" },
      { s: "B", en: "I'm going to the park.", vi: "Tớ đang đi tới công viên." },
      { s: "A", en: "Is the market far?", vi: "Chợ có xa không?" },
      { s: "B", en: "No, it's near the hospital.", vi: "Không, nó ở gần bệnh viện." },
      { s: "A", en: "Let's go to the zoo on Sunday.", vi: "Chủ nhật mình đi sở thú nhé." },
      { s: "B", en: "Yes! I love the zoo.", vi: "Ừ! Tớ thích sở thú lắm." },
    ],
    vocab: "park, market, hospital, zoo",
  },
  // 8. Hoạt động hàng ngày (Daily activities)
  {
    lines: [
      { s: "A", en: "What time do you get up?", vi: "Mấy giờ bạn thức dậy?" },
      { s: "B", en: "I get up at six. Then I brush my teeth.", vi: "Tớ dậy lúc sáu giờ. Sau đó đánh răng." },
      { s: "A", en: "Do you have breakfast?", vi: "Bạn có ăn sáng không?" },
      { s: "B", en: "Yes, then I go to school.", vi: "Có, rồi tớ đi học." },
      { s: "A", en: "What do you do in the evening?", vi: "Buổi tối bạn làm gì?" },
      { s: "B", en: "I do my homework and go to bed.", vi: "Tớ làm bài tập rồi đi ngủ." },
    ],
    vocab: "get up, brush my teeth, have breakfast, go to school, do homework, go to bed",
  },
  // 9. Hoạt động trong lớp học (Classroom activities)
  {
    lines: [
      { s: "A", en: "Open your book, please.", vi: "Hãy mở sách ra." },
      { s: "B", en: "OK. Now what?", vi: "Vâng ạ. Giờ làm gì ạ?" },
      { s: "A", en: "Listen and repeat after me.", vi: "Hãy lắng nghe và nhắc lại theo cô." },
      { s: "B", en: "Can I ask a question?", vi: "Em hỏi một câu được không ạ?" },
      { s: "A", en: "Of course. Raise your hand.", vi: "Tất nhiên. Hãy giơ tay lên." },
      { s: "B", en: "Thank you, teacher.", vi: "Em cảm ơn cô ạ." },
    ],
    vocab: "open your book, listen, repeat, ask, raise your hand",
  },
  // 10. Đồ dùng học tập (School things)
  {
    lines: [
      { s: "A", en: "Can I borrow a pen?", vi: "Tớ mượn cái bút được không?" },
      { s: "B", en: "Sure. Here is a pen and a pencil.", vi: "Được. Đây là bút mực và bút chì." },
      { s: "A", en: "I need a ruler too.", vi: "Tớ cần cả thước kẻ nữa." },
      { s: "B", en: "It's in my pencil case.", vi: "Nó ở trong hộp bút của tớ." },
      { s: "A", en: "Where is my rubber?", vi: "Cục tẩy của tớ đâu rồi?" },
      { s: "B", en: "It's in your bag.", vi: "Nó ở trong cặp của bạn." },
    ],
    vocab: "pen, pencil, ruler, pencil case, rubber, bag",
  },
  // 11. Bộ phận cơ thể (Body parts)
  {
    lines: [
      { s: "A", en: "Touch your head!", vi: "Chạm vào đầu nào!" },
      { s: "B", en: "OK! Now my nose.", vi: "Được! Giờ đến mũi tớ." },
      { s: "A", en: "How many eyes do you have?", vi: "Bạn có mấy mắt?" },
      { s: "B", en: "I have two eyes and two ears.", vi: "Tớ có hai mắt và hai tai." },
      { s: "A", en: "Wave your hand!", vi: "Vẫy tay nào!" },
      { s: "B", en: "Ha ha, this is fun!", vi: "Ha ha, vui thật!" },
    ],
    vocab: "head, nose, eye, ear, hand",
  },
  // 12. Ngày trong tuần (Days of the week)
  {
    lines: [
      { s: "A", en: "What day is it today?", vi: "Hôm nay là thứ mấy?" },
      { s: "B", en: "It's Monday.", vi: "Thứ Hai." },
      { s: "A", en: "Do you go to school on Saturday?", vi: "Thứ Bảy bạn có đi học không?" },
      { s: "B", en: "No, Saturday and Sunday are the weekend.", vi: "Không, thứ Bảy và Chủ nhật là cuối tuần." },
      { s: "A", en: "What about tomorrow?", vi: "Còn ngày mai thì sao?" },
      { s: "B", en: "Tomorrow is Tuesday.", vi: "Ngày mai là thứ Ba." },
    ],
    vocab: "Monday, Saturday, Sunday, weekend, tomorrow, Tuesday",
  },
  // 13. Quần áo (Clothes)
  {
    lines: [
      { s: "A", en: "I like your T-shirt!", vi: "Tớ thích áo phông của bạn!" },
      { s: "B", en: "Thank you! I like your dress too.", vi: "Cảm ơn! Tớ cũng thích váy của bạn." },
      { s: "A", en: "It's cold today.", vi: "Hôm nay trời lạnh." },
      { s: "B", en: "Yes, put on your jacket and scarf.", vi: "Ừ, mặc áo khoác và quàng khăn vào." },
      { s: "A", en: "Where are my shoes?", vi: "Giày của tớ đâu rồi?" },
      { s: "B", en: "They're near the door.", vi: "Chúng ở gần cửa." },
    ],
    vocab: "T-shirt, dress, jacket, scarf, shoes",
  },
  // 14. Phương tiện giao thông (Transport)
  {
    lines: [
      { s: "A", en: "How do you go to school?", vi: "Bạn đi học bằng gì?" },
      { s: "B", en: "I go by bus. And you?", vi: "Tớ đi xe buýt. Còn bạn?" },
      { s: "A", en: "I ride my bike.", vi: "Tớ đạp xe đạp." },
      { s: "B", en: "Look! An ambulance!", vi: "Nhìn kìa! Một xe cứu thương!" },
      { s: "A", en: "And a fire engine behind it.", vi: "Và một xe cứu hỏa phía sau nó." },
      { s: "B", en: "Wow, they're fast!", vi: "Ồ, chúng nhanh thật!" },
    ],
    vocab: "bus, bike, ambulance, fire engine",
  },
  // 15. Hoạt động vui chơi (Free-time activities)
  {
    lines: [
      { s: "A", en: "What do you do in your free time?", vi: "Lúc rảnh bạn làm gì?" },
      { s: "B", en: "I play football with my friends.", vi: "Tớ chơi bóng đá với bạn bè." },
      { s: "A", en: "Can you swim?", vi: "Bạn biết bơi không?" },
      { s: "B", en: "Yes! I also like to listen to music.", vi: "Có! Tớ cũng thích nghe nhạc." },
      { s: "A", en: "Let's fly a kite this weekend.", vi: "Cuối tuần này mình thả diều nhé." },
      { s: "B", en: "Sounds great!", vi: "Nghe hay đấy!" },
    ],
    vocab: "play football, swim, listen to music, fly a kite",
  },
  // 16. Các phòng trong nhà (Rooms in the house)
  {
    lines: [
      { s: "A", en: "This is my house. Come in!", vi: "Đây là nhà tớ. Vào đi!" },
      { s: "B", en: "Wow, the living room is big.", vi: "Ồ, phòng khách rộng quá." },
      { s: "A", en: "The kitchen is over there.", vi: "Nhà bếp ở đằng kia." },
      { s: "B", en: "Where is your bedroom?", vi: "Phòng ngủ của bạn ở đâu?" },
      { s: "A", en: "Upstairs, next to the bathroom.", vi: "Ở trên gác, cạnh phòng tắm." },
      { s: "B", en: "Your house is lovely!", vi: "Nhà bạn đáng yêu quá!" },
    ],
    vocab: "living room, kitchen, bedroom, bathroom",
  },
  // 17. Các loại quả (Fruits)
  {
    lines: [
      { s: "A", en: "What fruit do you like?", vi: "Bạn thích quả gì?" },
      { s: "B", en: "I like apples and bananas.", vi: "Tớ thích táo và chuối." },
      { s: "A", en: "Do you like grapes?", vi: "Bạn có thích nho không?" },
      { s: "B", en: "Yes, I do. I love grapes!", vi: "Có chứ. Tớ rất thích nho!" },
      { s: "A", en: "Here is an orange for you.", vi: "Đây là một quả cam cho bạn." },
      { s: "B", en: "Thank you! I love oranges too.", vi: "Cảm ơn! Tớ cũng thích cam." },
    ],
    vocab: "apple, banana, grape, orange",
  },
  // 18. Thức ăn (Food)
  {
    lines: [
      { s: "A", en: "What do you have for lunch?", vi: "Bữa trưa bạn ăn gì?" },
      { s: "B", en: "I have rice and chicken.", vi: "Tớ ăn cơm và thịt gà." },
      { s: "A", en: "Do you like pizza?", vi: "Bạn có thích pizza không?" },
      { s: "B", en: "Yes! And I love ice cream.", vi: "Có! Và tớ rất thích kem." },
      { s: "A", en: "Would you like some water?", vi: "Bạn uống chút nước nhé?" },
      { s: "B", en: "Yes, please. Thank you.", vi: "Vâng ạ. Cảm ơn bạn." },
    ],
    vocab: "rice, chicken, pizza, ice cream, water",
  },
  // 19. Cảm xúc (Feelings)
  {
    lines: [
      { s: "A", en: "How are you today?", vi: "Hôm nay bạn thế nào?" },
      { s: "B", en: "I'm happy! It's my birthday.", vi: "Tớ vui lắm! Hôm nay sinh nhật tớ." },
      { s: "A", en: "Happy birthday! Why is Tom sad?", vi: "Chúc mừng sinh nhật! Sao Tom buồn vậy?" },
      { s: "B", en: "He is tired and a bit hungry.", vi: "Cậu ấy mệt và hơi đói." },
      { s: "A", en: "Let's give him some cake.", vi: "Mình cho cậu ấy ít bánh nhé." },
      { s: "B", en: "Good idea! Now he's excited.", vi: "Ý hay! Giờ cậu ấy hào hứng rồi." },
    ],
    vocab: "happy, sad, tired, hungry, excited",
  },
  // 20. Giác quan (Senses)
  {
    lines: [
      { s: "A", en: "Use your eyes to see.", vi: "Dùng mắt để nhìn." },
      { s: "B", en: "And I use my ears to hear.", vi: "Và tớ dùng tai để nghe." },
      { s: "A", en: "Smell this flower!", vi: "Ngửi bông hoa này đi!" },
      { s: "B", en: "Mmm, it's nice. This candy is sweet.", vi: "Mmm, thơm thật. Viên kẹo này ngọt." },
      { s: "A", en: "The lemon is sour!", vi: "Quả chanh thì chua!" },
      { s: "B", en: "Ha ha, touch it, it's soft.", vi: "Ha ha, chạm vào đi, nó mềm." },
    ],
    vocab: "see, hear, smell, sweet, sour, soft",
  },
  // 21. Trò chơi (Games)
  {
    lines: [
      { s: "A", en: "Let's play a game!", vi: "Mình chơi trò chơi đi!" },
      { s: "B", en: "OK! How about hide-and-seek?", vi: "Được! Hay là trốn tìm nhé?" },
      { s: "A", en: "Or we can play chess.", vi: "Hoặc mình chơi cờ vua." },
      { s: "B", en: "I like the puzzle better.", vi: "Tớ thích trò xếp hình hơn." },
      { s: "A", en: "Let's do rock-paper-scissors first.", vi: "Mình oẳn tù tì trước đi." },
      { s: "B", en: "OK! Rock, paper, scissors!", vi: "Được! Oẳn, tù, tì!" },
    ],
    vocab: "hide-and-seek, chess, puzzle, rock-paper-scissors",
  },
];

window.dialogues = DIALOGUES;
