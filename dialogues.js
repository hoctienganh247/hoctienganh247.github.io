// Học Tiếng Anh — Hội thoại mẫu Lớp 1–5 (dữ liệu cho bài tập "Hội thoại")
// Sinh từ dialogues.md. Thứ tự 35 bài KHỚP đúng thứ tự 35 chủ đề trong data.js (index = currentDay - 1).
// Mỗi bài: { lines: [{ s:"A"|"B", en, vi }], vocab: "..." }

const DIALOGUES = [
  // ===================== LỚP 1 =====================
  // 1. Màu sắc (Colors)
  {
    lines: [
      { s: "A", en: "Hello! What colour is this?", vi: "Xin chào! Đây là màu gì?" },
      { s: "B", en: "It's red.", vi: "Màu đỏ." },
      { s: "A", en: "And this one?", vi: "Còn cái này?" },
      { s: "B", en: "It's blue. I like blue.", vi: "Màu xanh dương. Tớ thích màu xanh dương." },
      { s: "A", en: "Look! A rainbow!", vi: "Nhìn kìa! Một cầu vồng!" },
      { s: "B", en: "Wow! Red, yellow and green!", vi: "Ồ! Đỏ, vàng và xanh lá!" },
    ],
    vocab: "red, blue, yellow, green, rainbow",
  },
  // 2. Số đếm (Numbers)
  {
    lines: [
      { s: "A", en: "Can you count to five?", vi: "Bạn đếm đến năm được không?" },
      { s: "B", en: "Yes! One, two, three, four, five.", vi: "Được! Một, hai, ba, bốn, năm." },
      { s: "A", en: "How many apples are there?", vi: "Có bao nhiêu quả táo?" },
      { s: "B", en: "There are ten apples.", vi: "Có mười quả táo." },
      { s: "A", en: "Great! Now count to twelve.", vi: "Giỏi lắm! Giờ đếm đến mười hai nào." },
      { s: "B", en: "Ten, eleven, twelve!", vi: "Mười, mười một, mười hai!" },
    ],
    vocab: "one, two, three, four, five, ten, eleven, twelve",
  },
  // 3. Trái cây (Fruits)
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
  // 4. Động vật (Animals)
  {
    lines: [
      { s: "A", en: "Look at the dog!", vi: "Nhìn con chó kìa!" },
      { s: "B", en: "It's so cute. I have a cat.", vi: "Nó dễ thương quá. Tớ có một con mèo." },
      { s: "A", en: "Do you like tigers?", vi: "Bạn có thích hổ không?" },
      { s: "B", en: "No, tigers are scary. I like rabbits.", vi: "Không, hổ đáng sợ lắm. Tớ thích thỏ." },
      { s: "A", en: "Look! An elephant is big!", vi: "Nhìn kìa! Con voi to ghê!" },
      { s: "B", en: "Yes, and the bird is small.", vi: "Ừ, còn con chim thì bé." },
    ],
    vocab: "dog, cat, tiger, rabbit, elephant, bird",
  },
  // 5. Đồ dùng học tập (School Things)
  {
    lines: [
      { s: "A", en: "Is this your pencil?", vi: "Đây có phải bút chì của bạn không?" },
      { s: "B", en: "Yes, it is. Thank you.", vi: "Đúng rồi. Cảm ơn bạn." },
      { s: "A", en: "Can I use your ruler?", vi: "Tớ mượn thước kẻ của bạn được không?" },
      { s: "B", en: "Sure! Here you are.", vi: "Được chứ! Của bạn đây." },
      { s: "A", en: "Where is my book?", vi: "Quyển sách của tớ đâu rồi?" },
      { s: "B", en: "It's in your bag.", vi: "Nó ở trong cặp của bạn đấy." },
    ],
    vocab: "pencil, ruler, book, bag",
  },
  // 6. Cơ thể (Body)
  {
    lines: [
      { s: "A", en: "Touch your head!", vi: "Chạm vào đầu nào!" },
      { s: "B", en: "OK! My head, my hair.", vi: "Được! Đầu của tớ, tóc của tớ." },
      { s: "A", en: "Where are your eyes?", vi: "Mắt của bạn đâu?" },
      { s: "B", en: "Here! I have two eyes and one nose.", vi: "Đây! Tớ có hai mắt và một mũi." },
      { s: "A", en: "Show me your hands.", vi: "Cho tớ xem bàn tay của bạn." },
      { s: "B", en: "Look, my hands and my feet!", vi: "Nhìn này, tay và chân của tớ!" },
    ],
    vocab: "head, hair, eye, nose, hand, foot",
  },
  // 7. Gia đình (Family)
  {
    lines: [
      { s: "A", en: "Is this your family?", vi: "Đây là gia đình của bạn à?" },
      { s: "B", en: "Yes. This is my father and my mother.", vi: "Vâng. Đây là bố và mẹ tớ." },
      { s: "A", en: "Who is this?", vi: "Đây là ai?" },
      { s: "B", en: "This is my brother and my sister.", vi: "Đây là anh trai và chị gái tớ." },
      { s: "A", en: "And the baby?", vi: "Còn em bé?" },
      { s: "B", en: "That's my baby sister. I love my family.", vi: "Đó là em gái tớ. Tớ yêu gia đình mình." },
    ],
    vocab: "family, father, mother, brother, sister, baby",
  },
  // ===================== LỚP 2 =====================
  // 8. Rau củ (Vegetables)
  {
    lines: [
      { s: "A", en: "What's in the basket?", vi: "Trong giỏ có gì vậy?" },
      { s: "B", en: "There are carrots and tomatoes.", vi: "Có cà rốt và cà chua." },
      { s: "A", en: "Do you like broccoli?", vi: "Bạn có thích bông cải xanh không?" },
      { s: "B", en: "No, I don't. But I like corn.", vi: "Không. Nhưng tớ thích bắp ngô." },
      { s: "A", en: "Let's make a salad!", vi: "Cùng làm món salad nào!" },
      { s: "B", en: "Good idea! We need a cucumber too.", vi: "Ý hay đấy! Mình cần thêm một quả dưa chuột." },
    ],
    vocab: "carrot, tomato, broccoli, corn, salad, cucumber",
  },
  // 9. Đồ vật trong nhà (Household Objects)
  {
    lines: [
      { s: "A", en: "Where is my book?", vi: "Quyển sách của tớ đâu rồi?" },
      { s: "B", en: "It's on the table.", vi: "Nó ở trên bàn." },
      { s: "A", en: "Can you turn on the lamp?", vi: "Bạn bật đèn giúp tớ được không?" },
      { s: "B", en: "Sure. Please close the door too.", vi: "Được. Đóng cửa giúp tớ luôn nhé." },
      { s: "A", en: "Look at the clock! It's late.", vi: "Nhìn đồng hồ kìa! Muộn rồi." },
      { s: "B", en: "Yes, time to sleep. Sit on the sofa.", vi: "Ừ, đến giờ ngủ rồi. Ngồi xuống ghế sô-pha đi." },
    ],
    vocab: "table, lamp, door, clock, sofa",
  },
  // 10. Phòng ốc (Rooms)
  {
    lines: [
      { s: "A", en: "This is a big house!", vi: "Đây là một ngôi nhà to!" },
      { s: "B", en: "Yes. This is the living room.", vi: "Vâng. Đây là phòng khách." },
      { s: "A", en: "Where is the kitchen?", vi: "Nhà bếp ở đâu?" },
      { s: "B", en: "It's over there, next to the dining room.", vi: "Ở đằng kia, cạnh phòng ăn." },
      { s: "A", en: "Where is your bedroom?", vi: "Phòng ngủ của bạn ở đâu?" },
      { s: "B", en: "It's upstairs. The bathroom is upstairs too.", vi: "Ở trên tầng. Phòng tắm cũng ở trên tầng." },
    ],
    vocab: "house, living room, kitchen, dining room, bedroom, bathroom",
  },
  // 11. Thời tiết (Weather)
  {
    lines: [
      { s: "A", en: "How is the weather today?", vi: "Hôm nay thời tiết thế nào?" },
      { s: "B", en: "It's sunny and hot.", vi: "Trời nắng và nóng." },
      { s: "A", en: "Was it rainy yesterday?", vi: "Hôm qua trời có mưa không?" },
      { s: "B", en: "Yes, it was rainy and windy.", vi: "Có, trời mưa và có gió." },
      { s: "A", en: "Look, a rainbow in the sky!", vi: "Nhìn kìa, một cầu vồng trên trời!" },
      { s: "B", en: "Beautiful! I don't like cloudy days.", vi: "Đẹp quá! Tớ không thích những ngày nhiều mây." },
    ],
    vocab: "sunny, hot, rainy, windy, rainbow, sky, cloudy",
  },
  // 12. Quần áo (Clothes)
  {
    lines: [
      { s: "A", en: "I like your new shirt!", vi: "Tớ thích chiếc áo sơ mi mới của bạn!" },
      { s: "B", en: "Thank you! I like your dress.", vi: "Cảm ơn! Tớ thích chiếc váy của bạn." },
      { s: "A", en: "It's cold. Where is my coat?", vi: "Trời lạnh quá. Áo khoác của tớ đâu?" },
      { s: "B", en: "It's here. Don't forget your scarf.", vi: "Ở đây này. Đừng quên khăn quàng nhé." },
      { s: "A", en: "Are these your shoes?", vi: "Đây có phải giày của bạn không?" },
      { s: "B", en: "Yes, and these are my socks.", vi: "Đúng rồi, còn đây là tất của tớ." },
    ],
    vocab: "shirt, dress, coat, scarf, shoes, socks",
  },
  // 13. Đồ ăn (Food)
  {
    lines: [
      { s: "A", en: "What do you want for breakfast?", vi: "Bạn muốn ăn gì cho bữa sáng?" },
      { s: "B", en: "I want bread and an egg.", vi: "Tớ muốn bánh mì và một quả trứng." },
      { s: "A", en: "Do you want some milk?", vi: "Bạn có muốn uống sữa không?" },
      { s: "B", en: "Yes, please. I'm thirsty.", vi: "Có, làm ơn. Tớ khát nước." },
      { s: "A", en: "For lunch we have rice and chicken.", vi: "Bữa trưa mình có cơm và thịt gà." },
      { s: "B", en: "Yummy! And cake for dessert?", vi: "Ngon quá! Còn bánh ngọt tráng miệng nữa chứ?" },
    ],
    vocab: "breakfast, bread, egg, milk, rice, chicken, cake",
  },
  // 14. Hình dạng (Shapes)
  {
    lines: [
      { s: "A", en: "What shape is the sun?", vi: "Mặt trời có hình gì?" },
      { s: "B", en: "It's a circle.", vi: "Đó là hình tròn." },
      { s: "A", en: "And the window?", vi: "Còn cửa sổ?" },
      { s: "B", en: "It's a square. The door is a rectangle.", vi: "Hình vuông. Cánh cửa là hình chữ nhật." },
      { s: "A", en: "Can you draw a star?", vi: "Bạn vẽ một ngôi sao được không?" },
      { s: "B", en: "Yes! And a big heart too.", vi: "Được! Và một trái tim to nữa." },
    ],
    vocab: "circle, square, rectangle, star, heart, big",
  },
  // ===================== LỚP 3 =====================
  // 15. Nghề nghiệp (Jobs)
  {
    lines: [
      { s: "A", en: "What does your father do?", vi: "Bố bạn làm nghề gì?" },
      { s: "B", en: "He is a doctor. What about your mother?", vi: "Bố tớ là bác sĩ. Còn mẹ bạn thì sao?" },
      { s: "A", en: "She is a teacher.", vi: "Mẹ tớ là giáo viên." },
      { s: "B", en: "Cool! What do you want to be?", vi: "Hay quá! Bạn muốn làm nghề gì?" },
      { s: "A", en: "I want to be a pilot. And you?", vi: "Tớ muốn làm phi công. Còn bạn?" },
      { s: "B", en: "I want to be a cook in a big restaurant.", vi: "Tớ muốn làm đầu bếp trong một nhà hàng lớn." },
    ],
    vocab: "doctor, teacher, pilot, cook",
  },
  // 16. Phương tiện (Vehicles)
  {
    lines: [
      { s: "A", en: "How do you go to school?", vi: "Bạn đi học bằng gì?" },
      { s: "B", en: "I go to school by bus. And you?", vi: "Tớ đi học bằng xe buýt. Còn bạn?" },
      { s: "A", en: "I go by bicycle. It's fun!", vi: "Tớ đi bằng xe đạp. Vui lắm!" },
      { s: "B", en: "Have you ever been on a plane?", vi: "Bạn đã đi máy bay bao giờ chưa?" },
      { s: "A", en: "Yes, once. I went to the beach by car and plane.", vi: "Rồi, một lần. Tớ đi biển bằng ô tô và máy bay." },
      { s: "B", en: "Wow! I want to travel by train next time.", vi: "Tuyệt! Lần tới tớ muốn đi bằng tàu hỏa." },
    ],
    vocab: "bus, bicycle, plane, car, train",
  },
  // 17. Địa điểm (Places)
  {
    lines: [
      { s: "A", en: "Where are you going?", vi: "Bạn đang đi đâu vậy?" },
      { s: "B", en: "I'm going to the library.", vi: "Tớ đang đến thư viện." },
      { s: "A", en: "Is it near the park?", vi: "Nó có gần công viên không?" },
      { s: "B", en: "Yes, it's next to the hospital.", vi: "Có, nó nằm cạnh bệnh viện." },
      { s: "A", en: "Can we go to the market after?", vi: "Sau đó mình đi chợ được không?" },
      { s: "B", en: "Sure, and then to the cinema!", vi: "Được chứ, rồi đi rạp chiếu phim nữa!" },
    ],
    vocab: "library, park, hospital, market, cinema",
  },
  // 18. Thể thao (Sports)
  {
    lines: [
      { s: "A", en: "What sport do you like?", vi: "Bạn thích môn thể thao nào?" },
      { s: "B", en: "I like football. How about you?", vi: "Tớ thích bóng đá. Còn bạn?" },
      { s: "A", en: "I like swimming and basketball.", vi: "Tớ thích bơi lội và bóng rổ." },
      { s: "B", en: "Can you play tennis?", vi: "Bạn chơi quần vợt được không?" },
      { s: "A", en: "No, but I'm good at running.", vi: "Không, nhưng tớ chạy bộ giỏi." },
      { s: "B", en: "Let's play badminton this weekend!", vi: "Cuối tuần này mình chơi cầu lông nhé!" },
    ],
    vocab: "football, swimming, basketball, tennis, running, badminton",
  },
  // 19. Tính từ (Adjectives)
  {
    lines: [
      { s: "A", en: "Look at that building! It's so tall.", vi: "Nhìn tòa nhà kia kìa! Cao thật." },
      { s: "B", en: "Yes, but my house is small.", vi: "Ừ, nhưng nhà tớ thì nhỏ." },
      { s: "A", en: "Are you happy today?", vi: "Hôm nay bạn có vui không?" },
      { s: "B", en: "Yes, very happy! Why are you sad?", vi: "Có, rất vui! Sao bạn buồn vậy?" },
      { s: "A", en: "My old bike is slow.", vi: "Chiếc xe đạp cũ của tớ chạy chậm." },
      { s: "B", en: "Don't worry. My new bike is fast — let's ride!", vi: "Đừng lo. Xe mới của tớ nhanh lắm — đi nào!" },
    ],
    vocab: "tall, small, happy, sad, old, slow, new, fast",
  },
  // 20. Thiên nhiên (Nature)
  {
    lines: [
      { s: "A", en: "What a beautiful place!", vi: "Nơi này đẹp quá!" },
      { s: "B", en: "Yes! Look at the big mountain.", vi: "Ừ! Nhìn ngọn núi to kìa." },
      { s: "A", en: "There is a river near the forest.", vi: "Có một con sông gần khu rừng." },
      { s: "B", en: "I can see flowers and trees.", vi: "Tớ thấy hoa và cây." },
      { s: "A", en: "Look up! The sun is bright.", vi: "Nhìn lên kìa! Mặt trời sáng rực." },
      { s: "B", en: "And at night we can see the moon and stars.", vi: "Và ban đêm mình có thể thấy mặt trăng và các vì sao." },
    ],
    vocab: "mountain, river, forest, flower, tree, sun, moon, star",
  },
  // 21. Ngày tháng (Days & Months)
  {
    lines: [
      { s: "A", en: "What day is it today?", vi: "Hôm nay là thứ mấy?" },
      { s: "B", en: "It's Monday.", vi: "Hôm nay là thứ Hai." },
      { s: "A", en: "Do you have English on Wednesday?", vi: "Thứ Tư bạn có học tiếng Anh không?" },
      { s: "B", en: "Yes. I play football on Friday.", vi: "Có. Tớ chơi bóng đá vào thứ Sáu." },
      { s: "A", en: "What do you do on Sunday?", vi: "Chủ nhật bạn làm gì?" },
      { s: "B", en: "On Sunday I rest. I like summer holidays best!", vi: "Chủ nhật tớ nghỉ ngơi. Tớ thích kỳ nghỉ hè nhất!" },
    ],
    vocab: "Monday, Wednesday, Friday, Sunday, summer",
  },
  // ===================== LỚP 4 =====================
  // 22. Động vật hoang dã (Wild Animals)
  {
    lines: [
      { s: "A", en: "Which animal is the tallest at the zoo?", vi: "Con vật nào cao nhất ở sở thú?" },
      { s: "B", en: "The giraffe! Its neck is very long.", vi: "Hươu cao cổ! Cổ của nó rất dài." },
      { s: "A", en: "I love the zebra with black and white stripes.", vi: "Tớ thích con ngựa vằn với sọc đen trắng." },
      { s: "B", en: "Be careful — the crocodile is dangerous!", vi: "Cẩn thận đấy — con cá sấu nguy hiểm lắm!" },
      { s: "A", en: "Look, a monkey is climbing the tree.", vi: "Nhìn kìa, một con khỉ đang leo cây." },
      { s: "B", en: "And the penguins are swimming in the water.", vi: "Còn mấy con chim cánh cụt đang bơi dưới nước." },
    ],
    vocab: "giraffe, zebra, crocodile, monkey, penguin",
  },
  // 23. Môn học (School Subjects)
  {
    lines: [
      { s: "A", en: "What's your favourite subject?", vi: "Môn học yêu thích của bạn là gì?" },
      { s: "B", en: "I like science the best. What about you?", vi: "Tớ thích môn Khoa học nhất. Còn bạn?" },
      { s: "A", en: "I love maths, but history is hard for me.", vi: "Tớ thích Toán, nhưng môn Lịch sử khó với tớ." },
      { s: "B", en: "Do we have English today?", vi: "Hôm nay mình có học tiếng Anh không?" },
      { s: "A", en: "Yes, and music after lunch.", vi: "Có, và môn Âm nhạc sau bữa trưa." },
      { s: "B", en: "Great! I really enjoy art and music.", vi: "Tuyệt! Tớ rất thích môn Mĩ thuật và Âm nhạc." },
    ],
    vocab: "science, maths, history, English, music, art",
  },
  // 24. Công nghệ (Technology)
  {
    lines: [
      { s: "A", en: "Can I use your computer?", vi: "Tớ dùng máy tính của bạn được không?" },
      { s: "B", en: "Sure. The keyboard is a bit old.", vi: "Được. Bàn phím hơi cũ một chút." },
      { s: "A", en: "I need to send an email to my teacher.", vi: "Tớ cần gửi email cho cô giáo." },
      { s: "B", en: "OK. Is the internet working?", vi: "Được. Mạng internet có hoạt động không?" },
      { s: "A", en: "Yes. Can I use your headphones too?", vi: "Có. Tớ mượn tai nghe của bạn luôn được không?" },
      { s: "B", en: "Of course. But the battery is low, charge the phone.", vi: "Tất nhiên rồi. Nhưng pin yếu rồi, sạc điện thoại đi." },
    ],
    vocab: "computer, keyboard, email, internet, headphones, battery, phone",
  },
  // 25. Cảm xúc (Emotions)
  {
    lines: [
      { s: "A", en: "You look happy today!", vi: "Hôm nay trông bạn vui ghê!" },
      { s: "B", en: "I am! I'm excited about my birthday.", vi: "Đúng vậy! Tớ háo hức vì sinh nhật của mình." },
      { s: "A", en: "Why is your brother sad?", vi: "Sao em trai bạn buồn vậy?" },
      { s: "B", en: "He's tired and a little angry.", vi: "Em ấy mệt và hơi tức giận." },
      { s: "A", en: "Are you scared of the dark?", vi: "Bạn có sợ bóng tối không?" },
      { s: "B", en: "A little, but I try to stay calm.", vi: "Hơi sợ, nhưng tớ cố giữ bình tĩnh." },
    ],
    vocab: "happy, excited, sad, tired, angry, scared, calm",
  },
  // 26. Hoạt động hằng ngày (Daily Activities)
  {
    lines: [
      { s: "A", en: "What time do you wake up?", vi: "Bạn thức dậy lúc mấy giờ?" },
      { s: "B", en: "I wake up at six and brush my teeth.", vi: "Tớ dậy lúc sáu giờ và đánh răng." },
      { s: "A", en: "Do you have breakfast at home?", vi: "Bạn ăn sáng ở nhà à?" },
      { s: "B", en: "Yes, then I go to school.", vi: "Ừ, rồi tớ đi học." },
      { s: "A", en: "What do you do after school?", vi: "Sau giờ học bạn làm gì?" },
      { s: "B", en: "I do my homework and watch TV before I go to bed.", vi: "Tớ làm bài tập và xem tivi trước khi đi ngủ." },
    ],
    vocab: "wake up, brush teeth, have breakfast, go to school, do homework, watch TV, go to bed",
  },
  // 27. Môi trường (Environment)
  {
    lines: [
      { s: "A", en: "Why do we recycle paper and plastic?", vi: "Tại sao chúng ta tái chế giấy và nhựa?" },
      { s: "B", en: "To protect the earth and keep it clean.", vi: "Để bảo vệ trái đất và giữ nó sạch sẽ." },
      { s: "A", en: "There is too much rubbish here.", vi: "Ở đây quá nhiều rác." },
      { s: "B", en: "Yes. Let's put it in the bin.", vi: "Ừ. Mình bỏ vào thùng rác đi." },
      { s: "A", en: "Pollution is bad for nature.", vi: "Ô nhiễm có hại cho thiên nhiên." },
      { s: "B", en: "Right. We should plant more trees.", vi: "Đúng vậy. Chúng ta nên trồng thêm nhiều cây." },
    ],
    vocab: "recycle, plastic, earth, clean, rubbish, bin, pollution, nature, plant",
  },
  // 28. Cơ thể nâng cao (Body — Advanced)
  {
    lines: [
      { s: "A", en: "The doctor says my bones are strong.", vi: "Bác sĩ nói xương của tớ chắc khỏe." },
      { s: "B", en: "Good! Exercise is good for your heart.", vi: "Tốt đấy! Tập thể dục tốt cho tim." },
      { s: "A", en: "When I run, I breathe with my lungs.", vi: "Khi chạy, tớ thở bằng phổi." },
      { s: "B", en: "And your brain helps you think.", vi: "Và bộ não giúp bạn suy nghĩ." },
      { s: "A", en: "I hurt my knee yesterday.", vi: "Hôm qua tớ bị đau đầu gối." },
      { s: "B", en: "Oh no! Does your shoulder hurt too?", vi: "Ôi không! Vai bạn có đau không?" },
    ],
    vocab: "bone, heart, lungs, brain, knee, shoulder",
  },
  // ===================== LỚP 5 =====================
  // 29. Thành phố (The City)
  {
    lines: [
      { s: "A", en: "Excuse me, where is the nearest hotel?", vi: "Xin lỗi, khách sạn gần nhất ở đâu ạ?" },
      { s: "B", en: "Go straight and turn left at the traffic light.", vi: "Đi thẳng rồi rẽ trái ở chỗ đèn giao thông." },
      { s: "A", en: "Is it far from the bus stop?", vi: "Nó có xa trạm xe buýt không?" },
      { s: "B", en: "No, it's near the bridge, next to the mall.", vi: "Không, nó gần cây cầu, cạnh trung tâm thương mại." },
      { s: "A", en: "Can I take the subway there?", vi: "Tôi đi tàu điện ngầm đến đó được không?" },
      { s: "B", en: "Yes. The station is at the corner of the street.", vi: "Được. Ga ở góc phố này." },
    ],
    vocab: "hotel, traffic light, bus stop, bridge, mall, subway, corner, street",
  },
  // 30. Khoa học (Science)
  {
    lines: [
      { s: "A", en: "What are we doing in science today?", vi: "Hôm nay mình làm gì trong môn Khoa học?" },
      { s: "B", en: "We're doing an experiment with a magnet.", vi: "Mình làm thí nghiệm với nam châm." },
      { s: "A", en: "Cool! Does it use electricity?", vi: "Hay quá! Nó có dùng điện không?" },
      { s: "B", en: "No, but we will measure the temperature of water.", vi: "Không, nhưng mình sẽ đo nhiệt độ của nước." },
      { s: "A", en: "Why does the ball fall down?", vi: "Tại sao quả bóng rơi xuống?" },
      { s: "B", en: "Because of gravity. It's a kind of force.", vi: "Vì trọng lực. Đó là một loại lực." },
    ],
    vocab: "experiment, magnet, electricity, temperature, gravity, force",
  },
  // 31. Thế giới (The World)
  {
    lines: [
      { s: "A", en: "How many continents are there in the world?", vi: "Trên thế giới có bao nhiêu châu lục?" },
      { s: "B", en: "There are seven continents and many countries.", vi: "Có bảy châu lục và rất nhiều quốc gia." },
      { s: "A", en: "What's the capital of Vietnam?", vi: "Thủ đô của Việt Nam là gì?" },
      { s: "B", en: "It's Hanoi. Each country has its own flag.", vi: "Là Hà Nội. Mỗi quốc gia có lá cờ riêng." },
      { s: "A", en: "People speak different languages, right?", vi: "Mọi người nói các ngôn ngữ khác nhau, đúng không?" },
      { s: "B", en: "Yes. I'd love to learn about other cultures.", vi: "Đúng. Tớ rất muốn tìm hiểu về các nền văn hóa khác." },
    ],
    vocab: "continent, country, capital, flag, language, culture",
  },
  // 32. Động từ hành động (Action Verbs)
  {
    lines: [
      { s: "A", en: "What can you do well?", vi: "Bạn làm tốt việc gì?" },
      { s: "B", en: "I can swim and run very fast.", vi: "Tớ có thể bơi và chạy rất nhanh." },
      { s: "A", en: "Can you draw and write in English?", vi: "Bạn vẽ và viết tiếng Anh được không?" },
      { s: "B", en: "Yes. I also like to read and listen to music.", vi: "Được. Tớ cũng thích đọc và nghe nhạc." },
      { s: "A", en: "Let's build a model house together!", vi: "Mình cùng xây một mô hình nhà nhé!" },
      { s: "B", en: "Great idea! I'll help you fix the roof.", vi: "Ý hay đấy! Tớ sẽ giúp bạn sửa mái nhà." },
    ],
    vocab: "swim, run, draw, write, read, listen, build, fix",
  },
  // 33. Sức khỏe (Health)
  {
    lines: [
      { s: "A", en: "You look pale. Are you OK?", vi: "Trông bạn xanh xao quá. Bạn ổn chứ?" },
      { s: "B", en: "No, I feel sick. I have a headache and a fever.", vi: "Không, tớ thấy ốm. Tớ bị đau đầu và sốt." },
      { s: "A", en: "You should take some medicine and rest.", vi: "Bạn nên uống thuốc và nghỉ ngơi." },
      { s: "B", en: "OK. I should drink more water too.", vi: "Ừ. Tớ cũng nên uống nhiều nước hơn." },
      { s: "A", en: "To stay healthy, you need exercise and a good diet.", vi: "Để khỏe mạnh, bạn cần tập thể dục và ăn uống hợp lý." },
      { s: "B", en: "You're right. I'll eat more fruit and vegetables.", vi: "Bạn nói đúng. Tớ sẽ ăn nhiều rau quả hơn." },
    ],
    vocab: "sick, headache, fever, medicine, rest, healthy, exercise, diet",
  },
  // 34. Nghệ thuật (Arts)
  {
    lines: [
      { s: "A", en: "Do you like art?", vi: "Bạn có thích nghệ thuật không?" },
      { s: "B", en: "Yes! I enjoy painting and photography.", vi: "Có! Tớ thích vẽ tranh và nhiếp ảnh." },
      { s: "A", en: "Can you play any instrument?", vi: "Bạn chơi được nhạc cụ nào không?" },
      { s: "B", en: "I can play the piano. My sister plays the violin.", vi: "Tớ chơi được piano. Chị tớ chơi vĩ cầm." },
      { s: "A", en: "Would you like to see a drama at the theatre?", vi: "Bạn có muốn xem một vở kịch ở nhà hát không?" },
      { s: "B", en: "Sure! I love music, dance and films.", vi: "Có chứ! Tớ thích âm nhạc, nhảy múa và phim." },
    ],
    vocab: "painting, photography, piano, violin, drama, theatre, music, dance, film",
  },
  // 35. Nghề nghiệp tương lai (Future Jobs)
  {
    lines: [
      { s: "A", en: "What do you want to be in the future?", vi: "Tương lai bạn muốn làm gì?" },
      { s: "B", en: "I want to be a scientist and study space.", vi: "Tớ muốn làm nhà khoa học và nghiên cứu vũ trụ." },
      { s: "A", en: "Wow! I want to be an astronaut.", vi: "Tuyệt! Tớ muốn làm phi hành gia." },
      { s: "B", en: "My brother wants to be a programmer.", vi: "Anh tớ muốn làm lập trình viên." },
      { s: "A", en: "An engineer builds bridges, right?", vi: "Kĩ sư xây cầu, đúng không?" },
      { s: "B", en: "Yes. And an architect designs beautiful buildings.", vi: "Đúng. Còn kiến trúc sư thiết kế những tòa nhà đẹp." },
    ],
    vocab: "scientist, astronaut, programmer, engineer, architect",
  },
];

window.dialogues = DIALOGUES;
