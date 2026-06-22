/* ByteLab Engine v3 — Comprehensive Game Engine with EN/AR Translations */
(function() {
    const ASSETS = {
        logo:'../../../assets/logo.png', byteHello:'../../../assets/byte-hello.png', byteDetective:'../../../assets/byte-detective.png',
        bytePc:'../../../assets/byte-pc.png', byteHappy:'../../../assets/byte-happy.png', byteHang:'../../../assets/byte-hang.png',
        byteRich:'../../../assets/byte-rich.png', byteHacker:'../../../assets/byte-hacker.png', byteNinja:'../../../assets/byte-ninja.png',
        byteBook:'../../../assets/byte-book.png', byteLightning:'../../../assets/byte-lightning.png',
        byteSuperman:'../../../assets/byte-superman.png', byteMechanic:'../../../assets/byte-mechanic.png'
    };

    const ICONS = {
        check:'<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
        send:'<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>',
        shield:'<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
        bolt:'<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
        xmark:'<svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        crown:'<span class="premium-badge"><svg class="icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> PREMIUM</span>'
    };

    const ROOM_DATA = {
        en: {
            // World 0: Discovery (Tutorial)
            w0l1:{title:"Hidden View",desc:"The National Bank dashboard shows masked account balances. But the real balance is hidden in plain sight — somewhere in the DOM.",objective:"Inspect the page and find the element with display:none. Change it to display:block to reveal the hidden balance."},
            w0l2:{title:"Price Mod",desc:"A premium upgrade costs $999. But what if the price is just text that can be changed before the confirmation reads it?",objective:"Modify the price display in DevTools before clicking Upgrade Now. Pay what you want!"},
            w0l3:{title:"Lock Bypass",desc:"The Transfer Funds button has TWO layers of protection. A disabled attribute AND a CSS class blocking clicks.",objective:"Remove the disabled attribute AND the locked class from the Transfer Funds button to unlock it."},
            w0l4:{title:"Role Escalate",desc:"The dashboard thinks you're a guest. But your role is just a data attribute that can be rewritten.",objective:"Change data-role from 'guest' to 'admin' on the app-shell element to unlock admin controls."},
            w0l5:{title:"System Context Check",desc:"Inspect initialization parameters structure to unlock navigation variables.",objective:"Find and modify hidden system context variables to bypass navigation restrictions."},
            // World 1: PayPal
            w1l1:{title:"Disabled Bypass",desc:"The transfer button has a disabled markup attribute. Remove it to unlock click handlers.",objective:"Inspect the Transfer Funds button, find the 'disabled' attribute, and delete it from the tag."},
            w1l2:{title:"Pointer Lock Bypass",desc:"CSS pointer-events: none stops execution. Modify classes to bypass constraint.",objective:"Inspect the sidebar item, find class='locked', and delete 'locked' from the element's class list."},
            w1l3:{title:"Hidden Input Price",desc:"An transaction charge fee is hidden. Set value to negative numbers to earn cashback.",objective:"Locate the hidden input <input type='hidden' id='fee-amount'>, and set value='-150.00'. Then click Confirm."},
            w1l4:{title:"Invisible Balance",desc:"A balance display is hidden from layout via styles. Remove style display:none.",objective:"Inspect the overview cards, locate <p id='balance-real' style='display: none;'>, and remove the style attribute."},
            w1l5:{title:"Role Attribute Bypass",desc:"Authorization role members are stored on tags. Escalate member variables to admin.",objective:"Inspect the container, change data-role from 'member' to 'admin', and click the unlocked button."},
            // World 2: Netflix
            w2l1:{title:"Cookie Escalation",desc:"A local cookie stores membership tiers. Override details to premium to watch streams.",objective:"In your browser console, run: document.cookie = 'tier=premium'; then click the Play Stream button."},
            w2l2:{title:"Overlay DOM Deletion",desc:"Deletes overlays blocking active media objects to stream streams.",objective:"Find the div with id='subscription-overlay' in the inspect window, right-click, and choose 'Delete Element'."},
            w2l3:{title:"SSO Redirect Hijack",desc:"Bypass authorization logins redirect parameters. Change variables destination.",objective:"Change data-redirect attribute on the Google SSO button from original URL to 'http://evil.com'."},
            w2l4:{title:"Global Timer Abuse",desc:"A trial timer counts down in storage. Reset seconds values to stay inside trial.",objective:"Type: window.trialSecondsRemaining = 999999; in the console, then click Check session status."},
            w2l5:{title:"Prototype Pollution",desc:"Override object constructor defaults to register system authorizations as valid.",objective:"In your console, run: Object.prototype.isAuthorized = true; then click Verify Credentials."},
            // World 3: Amazon
            w3l1:{title:"Quantity Bypass",desc:"Change checkout products quantities to negative numbers to receive money refunds.",objective:"Inspect quantity input, remove min='1', set value to -10, and click Checkout."},
            w3l2:{title:"Custom Shipping Inject",desc:"Inject custom option values to select a free delivery method.",objective:"Right-click select dropdown, edit as HTML, insert <option value='0' selected>Free</option>."},
            w3l3:{title:"Hidden Tax Override",desc:"Sales charges rate is stored in input. Zero it out to skip checkout taxes.",objective:"Locate hidden input <input type='hidden' id='tax-rate'>, modify value='0.15' to value='0'."},
            w3l4:{title:"Readonly Coupon Bypass",desc:"Forms disable input via readonly attributes. Remove attribute to enter discount coupons.",objective:"Remove 'readonly' from coupon input, type 'FREE100', and click Checkout."},
            w3l5:{title:"DOM Parameter Inject",desc:"Form items lack validations. Add hidden input fields carrying promo parameters.",objective:"Append <input type='hidden' id='discount_value' value='500'> inside the form wrapper."},
            // World 4: SpaceX
            w4l1:{title:"SSO User ID Spoof",desc:"Cookie values identifies users. Modify current cookie values to administrative id (1).",objective:"In console: document.cookie = 'user_id=1'; then click Request Admin Panel."},
            w4l2:{title:"IP Proxy Override",desc:"Gateway verification checks client IP properties. Override gatewayIp variables.",objective:"Type: window.gatewayIp = '127.0.0.1'; in the console, then click request connection."},
            w4l3:{title:"Endpoint Path Tampering",desc:"Modify submission destinations stored inside button dataset attributes.",objective:"Change data-endpoint='/v1/public/save' to '/v1/admin/shutdown' on submit button."},
            w4l4:{title:"Host Header Spoofing",desc:"Modify target origin validation variables to trick CORS security frameworks.",objective:"Type: window.originHeader = 'workspacex.com'; in your browser console."},
            w4l5:{title:"LocalStorage Auth Bypass",desc:"LocalStorage records active auth sessions. Inject authorized flags directly.",objective:"Execute: localStorage.setItem('auth_status', 'authorized'); then click Enter Portal."},
            // World 5: Airbnb
            w5l1:{title:"Reverse Date Chronology",desc:"Airbnb dates logic checks booking durations. Reverse arrival/departures to get negative days.",objective:"Set check-out date before check-in date (e.g. check-in '2026-06-18', check-out '2026-06-15')."},
            w5l2:{title:"NaN Weight Injection",desc:"Form validates payload weight as numbers. Inject NaN strings to skip ceilings checks.",objective:"Change luggage input type='number' to 'text', type 'NaN', click Book."},
            w5l3:{title:"Seat Tier Desync",desc:"Premium seats check membership variables. Mutate ticket ranks attributes to unlock seating.",objective:"Remove 'disabled' from seat 1A, set data-tier='economy', click the seat button."},
            w5l4:{title:"Open Redirect",desc:"Alter navigation anchors destinative parameters to redirect users outwards.",objective:"Change logo link href from '/' to 'http://evil.com' and click the logo."},
            w5l5:{title:"Config Variable Override",desc:"Verification processes check system configuration structures. Override checks properties.",objective:"Type: window.flightConfig = { bypass_verification: true }; in the console."},
            // World 6: OpenAI
            w6l1:{title:"Prompt Injection Leak",desc:"AI chat system prompt guidelines are hidden behind layout cards. Make them visible.",objective:"Find the hidden system prompt element and change its display to make it visible."},
            w6l2:{title:"Token Temperature Flood",desc:"Slider details accept decimals parameters. Force values past ceiling to abort threads.",objective:"Set the temperature input to a value greater than 2.0 via DevTools or console."},
            w6l3:{title:"Premium Stream Hijack",desc:"Blurs stream containers using CSS definitions. Remove the blur response class to read text.",objective:"Remove the .blur-response class from the response container to read the full output."},
            w6l4:{title:"System Instruction Swap",desc:"Change context flags on elements datasets properties from user to admin roles.",objective:"Change data-system-context from 'user' to 'admin' on the chat element."},
            w6l5:{title:"Pre-Seed Parameter Poison",desc:"Find hidden assistant_override options and flip them to true to dump developers flags.",objective:"Find hidden input name='assistant_override' and set its value to true."},
            // World 7: Teladoc
            w7l1:{title:"Prescription Multiplier",desc:"Modify local in-memory quantity parameters to multiply order items for the price of one.",objective:"Modify local quantity variables in memory to purchase 100x doses at single-dose cost."},
            w7l2:{title:"The Glass Backdrop",desc:"Delete glassmorphic modal blocks overlaying hidden patient records datasets.",objective:"Delete the modal overlay node from the DOM tree to reveal hidden patient data."},
            w7l3:{title:"Global Namespace Scrape",desc:"Access global dump variables on window scopes to harvest patient details.",objective:"Access window.__INTERNAL_PATIENT_DUMP__ from the console and parse patient records."},
            w7l4:{title:"Operational Interval Freeze",desc:"Disable or clear the countdown interval ID handle to bypass security timers.",objective:"Nullify the timer handle from the console to instantly skip the waiting boundary."},
            w7l5:{title:"Structural Constraint Sever",desc:"Change input parameters structures (date type details) to bypass age restrictions.",objective:"Change type='date' to 'text' and remove max attributes on medical forms."},
            // World 8: OpenSea
            w8l1:{title:"Cookie Allowance Expand",desc:"Mutate cookies options user_tier tags to whale classifications to bypass restrictions.",objective:"Change user_tier cookie from 'free' to 'whale' via the console."},
            w8l2:{title:"Verification State Inject",desc:"LocalStorage locks KYC options. Add kyc_approved status variables to trade.",objective:"Set localStorage kyc_approved to 'true' via the console."},
            w8l3:{title:"Endless Session Wrap",desc:"Set sessionStorage timestamp boundaries decades into the future.",objective:"Advance sessionStorage epoch values decades into the future."},
            w8l4:{title:"Base64 Claim Deconstruct",desc:"Base64-decode parameters inside local storage to set withdrawal indicators.",objective:"Base64-decode the token, flip can_withdraw to true, re-encode and save."},
            w8l5:{title:"Namespace Sabotage",desc:"Delete initialization variables tags from web storage to trigger fallback views.",objective:"Delete key initialization values from localStorage to trigger fallback mode."},
            // World 9: Tesla
            w9l1:{title:"Grid Row Deselection",desc:"Remove CSS display:none structures to show hidden panels.",objective:"Delete the .hidden-grids class from the stylesheet to reveal hidden control switches."},
            w9l2:{title:"DOM Node Fabrication",desc:"Manually construct elements triggers to execute internal backend callbacks.",objective:"Create a button with id='emergency-override-trigger' and inject it into the DOM."},
            w9l3:{title:"Target Endpoint Diverge",desc:"Change metric source path data properties to point to internal configurations.",objective:"Change data-source-path from '/api/public' to '/api/private/diagnostics'."},
            w9l4:{title:"Comment Mapping Extract",desc:"Audit HTML markup comment lines to find unmapped routing properties.",objective:"Find left-behind developer markup comments in HTML containing private routes."},
            w9l5:{title:"Notification Silencing",desc:"Unbind event listeners preventing violation detection logs from triggering.",objective:"Locate and remove event listener attachments that prevent violation detection."},
            // World 10: FedEx
            w10l1:{title:"The $0 Customs Valuation",desc:"Modify weight parameters values directly to bypass billing rules.",objective:"Rewrite the weight string on the manifest to bypass heavy-cargo billing."},
            w10l2:{title:"Event Interceptor Removal",desc:"Strip event preventDefault bindings on forms to bypass checks validations.",objective:"Strip out event.preventDefault handlers on the shipment form."},
            w10l3:{title:"Route ID Crawling",desc:"Alter numerical path parameters to view parallel shipment details.",objective:"Change /fleet/shipment/4001 to /4002 via console to access other routes."},
            w10l4:{title:"Asset Pipeline Hijack",desc:"Mutate onerror tags properties to execute custom inline callbacks.",objective:"Set onerror attributes on fleet images to execute unauthorized scripts."},
            w10l5:{title:"Source Map Harvesting",desc:"Audit production source maps configurations inside devtools to find credentials.",objective:"Recover hardcoded development keys from production source maps."}
        },
        ar: {
            // Arabic translations - World 0 to 10
            w0l1:{title:"عرض مخفي",desc:"لوحة تحكم البنك تخفي الارصدة الحقيقيه. لكن الرصيد الحقيقي موجود في DOM.",objective:"ابحث عن العنصر المخفي بـ display:none وغيره الي display:block لكشف الرصيد."},
            w0l2:{title:"تعديل السعر",desc:"الترقيه المميزه تكلف $999. لكن السعر مجرد نص يمكن تغييره.",objective:"عدل السعر في DevTools قبل النقر علي ترقيه الان. ادفع ما تريد!"},
            w0l3:{title:"فتح القفل",desc:"زر تحويل الاموال محمي بطبقتين: الخاصيه disabled وكود CSS.",objective:"احذف الخاصيه disabled والكود locked من زر تحويل الاموال."},
            w0l4:{title:"تصعيد الصلاحيه",desc:"لوحه التحكم تظن انك ضيف. لكن صلاحيتك هي مجرد خاصيه data-role.",objective:"غير data-role من guest الي admin في عنصر app-shell."},
            w0l5:{title:"فحص سياق النظام",desc:"افحص متغيرات التهيئه لفتح متغيرات التنقل.",objective:"جد وعدل متغيرات سياق النظام المخفيه لتجاوز قيود التنقل."},
            w1l1:{title:"تخطي تعطيل الزر",desc:"زر التحويل معطل. افحص عنصر DOM وازل سمة disabled.",objective:"افحص رابط قائمه تحويل الاموال وابحث عن السمه disabled وقم بحذفها."},
            w1l2:{title:"تخطي قفل المؤشر",desc:"مسار التحويلات مقفل عبر CSS. افحص القائمه وازل الفئه locked.",objective:"افحص الزر وابحث عن class='locked' ثم احذف locked من قائمه الفئات."},
            w1l3:{title:"تعديل حقل الرسوم المخفي",desc:"رسوم المعامله مخزنه داخل حقل ادخال مخفي. غير قيمته الي عدد سالب.",objective:"ابحث عن input type='hidden' id='fee-amount' واجعل قيمته '-150.00'."},
            w1l4:{title:"الرصيد المخفي",desc:"الرصيد الحقيقي للحساب مخفي. ابحث عن العنصر واجعله مرئيا.",objective:"ابحث عن المعرف id='balance-real' وقم بازاله style='display: none'."},
            w1l5:{title:"تخطي سمة الدور",desc:"تغير المنصه الخيارات بناء علي دور المستخدم. غير data-role من member الي admin.",objective:"افحص الحاويه وغير السمه الي admin ثم انقر فوق زر طلب السجلات."},
            w2l1:{title:"تصعيد صلاحيات الكوكي",desc:"يتم تحديد مستوي العضويه عبر كوكي. غيرها الي premium لتشغيل البث.",objective:"في الكونسول اكتب: document.cookie = 'tier=premium';"},
            w2l2:{title:"ازاله الغطاء الاعلاني",desc:"مشغل الفيديو مغطي بنافذه اشتراك. احذف عنصر subscription-overlay.",objective:"ابحث عن div بالمعرف id='subscription-overlay' واحذف العنصر."},
            w2l3:{title:"تزييف رابط توجيه SSO",desc:"زر تسجيل الدخول بجوجل يحتوي علي سمة للتوجيه. غيرها الي evil.com.",objective:"غير data-redirect الي 'http://evil.com' في زر جوجل."},
            w2l4:{title:"التلاعب بالعداد العام",desc:"عداد تنازلي يحد من جلستك. عدل window.trialSecondsRemaining الي 999999.",objective:"اكتب: window.trialSecondsRemaining = 999999; في الكونسول."},
            w2l5:{title:"تلوث البروتوتايب",desc:"المصادقه تتحقق باستخدام كائنات اساسيه. لوث النموذج الاولي.",objective:"اكتب: Object.prototype.isAuthorized = true; في الكونسول."},
            w3l1:{title:"تخطي الحد الادني للكميه",desc:"استماره الشراء تمنع الكميات السالبه. ازل min='1' واجعل الكميه -10.",objective:"احذف min='1' من حقل الكميه واكتب -10 ثم اضغط اتمام الطلب."},
            w3l2:{title:"حقن خيارات التوصيل",desc:"طرق الشحن مقصوره علي الخيارات المدفوعه. احقن خيارا جديدا بقيمه 0.",objective:"قم بتحرير القائمه ك HTML واحقن option value='0'."},
            w3l3:{title:"تخطي قيمه الضرائب",desc:"الضريبه محسوبه من حقل مخفي. غير قيمه tax-rate الي 0.",objective:"ابحث عن الحقل المخفي id='tax-rate' واجعل قيمته '0'."},
            w3l4:{title:"تجاوز الكوبون للقراءه فقط",desc:"حقل الكوبون محمي بـ readonly. ازل السمه واكتب FREE100.",objective:"احذف سمة readonly من حقل الكوبون واكتب 'FREE100'."},
            w3l5:{title:"حقن معلمات ال DOM",desc:"يقبل نظام الدفع معلمات اضافيه. احقن حقلا مخفيا جديدا.",objective:"اضف input type='hidden' id='discount_value' value='500' داخل النموذج."},
            w4l1:{title:"تزييف هويه SSO",desc:"تقري هويه المستخدم من كوكيز user_id. غيرها الي 1 لانتحال شخصيه المسؤول.",objective:"اكتب: document.cookie = 'user_id=1'; في الكونسول."},
            w4l2:{title:"تخطي عنوان ال IP",desc:"يقرا النظام اعدادات البوابه من كائن عام. غير window.gatewayIp الي 127.0.0.1.",objective:"اكتب: window.gatewayIp = '127.0.0.1'; في الكونسول."},
            w4l3:{title:"تلاعب بمسار النهايه",desc:"يوجه زر حفظ الاعدادات الطلبات الي مسار عام. عدلها.",objective:"غير data-endpoint الي '/v1/admin/shutdown'."},
            w4l4:{title:"تزييف ترويسه المضيف",desc:"يتحقق النظام من المضيف المسموح به. غير window.originHeader.",objective:"اكتب: window.originHeader = 'workspacex.com'; في الكونسول."},
            w4l5:{title:"تجاوز تخزين ال SSO",desc:"تتم قراءه حاله مصادقه SSO من التخزين المحلي. غيرها.",objective:"اكتب: localStorage.setItem('auth_status', 'authorized');"},
            w5l1:{title:"التلاعب بتسلسل التواريخ",desc:"نظام حجز الفنادق يحسب الفارق الزمني. اعكس التواريخ.",objective:"اجعل تاريخ المغادره قبل تاريخ الوصول للحصول علي مده سالبه."},
            w5l2:{title:"ادخال قيمه NaN",desc:"حقل الوزن يمنع كتابه النصوص. غير نوع المدخل واكتب NaN.",objective:"غير type='number' الي 'text' واكتب NaN."},
            w5l3:{title:"تخطي فئه المقعد",desc:"المقاعد الممتازه معطله للمستخدمين العاديين. ازل disabled.",objective:"احذف disabled من المقعد 1A واجعل data-tier='economy'."},
            w5l4:{title:"رابط اعاده التوجيه المفتوح",desc:"شعار الشركه يعيد التوجيه. غير href الي موقع خارجي.",objective:"غير href رابط الشعار الي 'http://evil.com'."},
            w5l5:{title:"تجاوز متغيرات التكوين",desc:"كائن الاعدادات يتحكم في التحقق. غير bypass_verification.",objective:"اكتب: window.flightConfig = { bypass_verification: true };"},
            w6l1:{title:"تسريب تعليمات النظام",desc:"واجهه ذكاء اصطناعي تخفي تعليماتها الداخليه باستخدام CSS.",objective:"جد عنصر تعليمات النظام المخفي واجعله مرئيا."},
            w6l2:{title:"فيضان درجه الحراره",desc:"عناصر التحكم تسمح بتعديل القيم العشريه. تجاوز الحد الاقصي.",objective:"غير قيمه درجه الحراره الي اكثر من 2.0 عبر DevTools."},
            w6l3:{title:"اختطاف البث المميز",desc:"تخطيط عرض البث يقيد طول النص المرئي بناء علي CSS.",objective:"احذف الكود .blur-response من حاويه الرد."},
            w6l4:{title:"تبديل تعليمات النظام",desc:"واجهه المحادثه تبدا بـ data-system-context بقيمه user.",objective:"غير data-system-context من user الي admin."},
            w6l5:{title:"تسميم الباراميترات الاوليه",desc:"حقل نموذج مخفي موجود داخل محرك التوليد.",objective:"جد المدخل المخفي assistant_override وغير قيمته الي true."},
            w7l1:{title:"مضاعف الوصفات الطبيه",desc:"نظام دفع الصيدليه يحسب الكميات باستخدام متغيرات من جهه العميل.",objective:"عدل المتغيرات المحليه في الذاكره لشراء 100x جرعه بسعر جرعه واحده."},
            w7l2:{title:"الخلفيه الزجاجيه",desc:"سجلات المرضي موجوده علي الصفحه لكن مغطاه بشاشه شفافه.",objective:"احذف العقدة الطبقية من شجره DOM للكشف عن بيانات المرضي المخفيه."},
            w7l3:{title:"مسح النطاق العام",desc:"كود امامي مهمل يكشف كائن بيانات المرضي في النطاق العام.",objective:"ادخل الي window.__INTERNAL_PATIENT_DUMP__ من الكونسول."},
            w7l4:{title:"تجميد الفاصل التشغيلي",desc:"بوابه الامان تفرض عدا تنازليا للتحقق باستخدام setInterval.",objective:"الغي موقت setInterval من الكونسول لتجاوز فتره الانتظار."},
            w7l5:{title:"كسر القيود الهيكليه",desc:"احذف تحققات صارمه من النماذج الطبيه لتمرير سلاسل غير صالحه.",objective:"غير type='date' الي 'text' واحذف max من النماذج الطبيه."},
            w8l1:{title:"توسيع صلاحيه الكوكيز",desc:"متعقب الاصول يخزن حدود الفئه في كوكيز غير HttpOnly.",objective:"غير user_tier cookie من 'free' الي 'whale'."},
            w8l2:{title:"حقن حاله التحقق",desc:"حاله KYC مخزنه في localStorage.",objective:"غير localStorage kyc_approved الي 'true' عبر الكونسول."},
            w8l3:{title:"تغليف الجلسه اللانهائي",desc:"طوابع وقت الجلسه مخزنه في sessionStorage.",objective:"قدم ارقام التحقق الزمنيه عقودا الي المستقبل."},
            w8l4:{title:"تفكيك مطالبات Base64",desc:"رمز اعدادات مشفر base64 مخزن في التخزين المحلي.",objective:"فك تشفير base64 واقلب can_withdraw الي true واعد تشفيره."},
            w8l5:{title:"تخريب مساحه الاسم",desc:"امسح مفاتيح التهيئه الاساسيه من التخزين لاجبار المحفظه علي حاله الطوارئ.",objective:"احذف قيم التهيئه من localStorage لتفعيل وضع الطوارئ."},
            w9l1:{title:"الغاء تحديد الصف",desc:"لوحه تحكم صناعيه تخفي مفاتيح تحكم الجهد العالي.",objective:"احذف الكود .hidden-grids من ورقه الانماط."},
            w9l2:{title:"تصنيع عقدة DOM",desc:"قم ببناء وحقن ترميز زر مخصص في لوحه القياده.",objective:"انشيء زر id='emergency-override-trigger' واحقنه في DOM."},
            w9l3:{title:"انحراف نقطه النهايه",desc:"مكون الشبكه يسحب المقاييس من مسار محدد.",objective:"غير data-source-path من '/api/public' الي '/api/private/diagnostics'."},
            w9l4:{title:"استخراج تعليقات المطور",desc:"امسح شجره DOM العميقه للبحث عن تعليقات مطور متروكه.",objective:"جد تعليقات HTML متروكه تحتوي علي مسارات رئيسيه داخليه."},
            w9l5:{title:"اسكات التنبيهات",desc:"فك ارتباط نصوص اعتراض التحذير لمنع اشعارات الامان.",objective:"احذف مستمعي الاحداث الذين يمنعون اكتشاف الانتهاكات."},
            w10l1:{title:"تقييم جمركي $0",desc:"بيان جمركي ينسخ اوزان الشحن من عقدة قابله للتعديل.",objective:"اعد كتابه سلسله الوزن لتجاوز قواعد فوتره الشحن."},
            w10l2:{title:"ازاله معترض الاحداث",desc:"مستمعو احداث دفاعيه يفحصون نماذج وزن الشحن.",objective:"احذف event.preventDefault من نموذج الشحن."},
            w10l3:{title:"زحف معرف المسار",desc:"عدل قيم الفهرسه الرقميه في انماط مسار الموارد.",objective:"غير /fleet/shipment/4001 الي /4002 عبر الكونسول."},
            w10l4:{title:"اختطاف خط الاصول",desc:"عدل مصادر صور المركبات باستخدام خصائص معالجه اخطاء.",objective:"ضع onerror علي صور الاسطول لتنفيذ نصوص تحقق."},
            w10l5:{title:"حصاد خرائط المصدر",desc:"تعمق في ملفات الانتاج المترجمه في تبويب المصادر.",objective:"استخرج مفاتيح تفويض التطوير المضمنه في خرائط المصدر."}
        }
    };

    function getRoomData() {
        const db = ROOM_DATA[state.lang] || ROOM_DATA.en;
        const key = 'w'+state.world+'l'+state.level;
        return db[key] || { title:"ByteLab Challenge", desc:"Inspect the target and find the vulnerability.", objective:"Exploit the client-side control to capture the flag." };
    }

    let state = { world:1, level:1, mode:'attack', lang:'en', hasWon:false, observer:null, watchInterval:null };

    const WORLDS = [
        { id:0, icon:'🎓' },{ id:1, icon:'🏦' },{ id:2, icon:'🎬' },{ id:3, icon:'🛒' },
        { id:4, icon:'🚀' },{ id:5, icon:'✈️' },{ id:6, icon:'🤖' },{ id:7, icon:'🏥' },
        { id:8, icon:'💎' },{ id:9, icon:'⚡' },{ id:10, icon:'📦' }
    ];

    const AudioEngine = {
        ctx:null, init(){if(!this.ctx)this.ctx=new(window.AudioContext||window.webkitAudioContext)()},
        playPop(){this.init();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(400,this.ctx.currentTime);o.frequency.exponentialRampToValueAtTime(800,this.ctx.currentTime+.12);g.gain.setValueAtTime(.08,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.12);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+.12)},
        playChime(){this.init();[523.25,659.25,783.99,1046.5].forEach((f,i)=>{const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sine';o.frequency.setValueAtTime(f,this.ctx.currentTime+i*.1);g.gain.setValueAtTime(.12,this.ctx.currentTime+i*.1);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+i*.1+.4);o.connect(g);g.connect(this.ctx.destination);o.start(this.ctx.currentTime+i*.1);o.stop(this.ctx.currentTime+i*.1+.4)})},
        playError(){this.init();const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(110,this.ctx.currentTime);o.frequency.linearRampToValueAtTime(70,this.ctx.currentTime+.35);g.gain.setValueAtTime(.14,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+.35);o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+.35)}
    };

    window.initLevel = function({world,level}) {
        state.world=world; state.level=level;
        const p=new URLSearchParams(window.location.search);
        state.mode=p.get('mode')||'attack';
        state.lang=p.get('lang')||(localStorage.getItem('bytelab_lang')||'en');
        document.documentElement.dir=state.lang==='ar'?'rtl':'ltr';
        document.documentElement.lang=state.lang;
        buildStructure(); renderLearnTab(); initMascot(); setupAudioTriggers();
    };

    function buildStructure() {
        document.body.innerHTML = `
<div id="transition-screen" style="position:fixed;inset:0;background:var(--primary);z-index:999;opacity:1;pointer-events:none;transition:opacity .5s"></div>
<header id="header-nav" role="banner">
    <div style="display:flex;align-items:center;gap:10px">
        <img src="${ASSETS.logo}" style="width:26px;height:26px;object-fit:contain" alt="ByteLab Logo">
        <span style="font-weight:800;font-size:1.1rem" aria-label="ByteLab">ByteLab</span>
    </div>
    <div style="display:flex;align-items:center;gap:12px">
        <div class="progress-rail" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"><div id="progress-bar" class="progress-fill"></div></div>
        <span id="progress-label" style="font-size:.7rem;font-weight:800;color:var(--secondary)">0%</span>
        <button onclick="quitToPortal()" style="background:none;border:none;font-weight:700;font-size:.8rem;color:var(--secondary);cursor:pointer;display:flex;align-items:center;gap:4px;padding:8px 12px;border-radius:8px" aria-label="Quit to portal">${ICONS.xmark} Quit</button>
    </div>
</header>
<div id="story-overlay" style="position:fixed;inset:0;background:white;z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto">
    <div id="room-brief" style="max-width:520px;width:100%"></div>
</div>
<main id="game-stage" style="display:none;grid-template-columns:1.1fr .9fr;flex:1;overflow:hidden" role="main">
    <div class="stage-panel left" id="left-play-panel" role="region" aria-label="Challenge Target"></div>
    <div class="stage-panel right" style="flex-direction:column">
        <div style="flex:1;display:flex;flex-direction:column" id="right-control-panel"></div>
        <div class="console-panel" id="terminal-logs" role="log" aria-live="polite"><div class="log-row info">&gt; Terminal online.</div></div>
    </div>
</main>
<div class="mascot-rig" id="mascot-hud" role="complementary" aria-label="Assistant">
    <div class="mascot-bubble" id="mascot-bubble-text">Hey there! Let's hack.</div>
    <img id="mascot-avatar" class="mascot-image" src="${ASSETS.byteHello}" alt="Byte Mascot">
</div>
<div id="feedback-drawer" style="display:none"></div>`;
        setTimeout(()=>{const t=document.getElementById('transition-screen');if(t)t.style.opacity='0'},300);
    }

    window.quitToPortal=function(){window.location.href='../../game.html'};

    function speak(text,duration=5000){
        const b=document.getElementById('mascot-bubble-text');
        if(!b)return; b.innerText=text; b.classList.add('open');
        clearTimeout(window.speakTimer);
        if(duration>0)window.speakTimer=setTimeout(()=>b.classList.remove('open'),duration);
    }

    function initMascot(){
        const img=document.getElementById('mascot-avatar');
        if(img)img.onclick=()=>{AudioEngine.playPop();speak("Use DevTools (F12) to inspect the left panel and find the vulnerability!")};
    }

    function setupAudioTriggers(){document.body.addEventListener('click',()=>AudioEngine.init(),{once:true})}

    function renderLearnTab(){
        const data=getRoomData();
        const w=document.getElementById('room-brief');
        const modeLabel = state.mode === 'attack' ? 'ATTACK' : 'DEFEND';
        const modeColor = state.mode === 'attack' ? 'var(--primary)' : '#2563eb';
        w.innerHTML=`
<div style="display:flex;flex-direction:column;gap:20px;animation:slideFadeIn .4s forwards">
    <div style="display:flex;align-items:center;gap:16px">
        <img src="${ASSETS.byteDetective}" style="width:64px;height:64px;object-fit:contain;border-radius:50%;box-shadow:0 4px 20px rgba(69,70,215,0.12)" alt="Byte Detective">
        <div>
            <span style="font-size:.7rem;font-weight:800;color:${modeColor};text-transform:uppercase;letter-spacing:.1em">${modeLabel} W${state.world}L${state.level}</span>
            <h1 style="font-family:var(--font-display);font-size:1.6rem;font-weight:800;margin-top:2px">${data.title}</h1>
        </div>
    </div>
    <div style="background:var(--bg);border-radius:20px;padding:20px;border:1px solid var(--border)">
        <p style="color:var(--text);font-size:.9rem;line-height:1.6">${data.desc}</p>
    </div>
    <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:20px;padding:18px;display:flex;gap:12px">
        <span style="width:28px;height:28px;background:var(--primary);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.8rem;flex-shrink:0;margin-top:1px" aria-hidden="true">!</span>
        <div>
            <span style="font-weight:800;font-size:.85rem;color:var(--primary)">Objective</span>
            <p style="font-size:.85rem;color:#4338ca;margin-top:4px;line-height:1.5">${data.objective}</p>
        </div>
    </div>
    <button onclick="startPlayMode()" style="background:${modeColor};color:white;border:none;padding:16px;border-radius:16px;font-weight:800;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 16px rgba(69,70,215,0.25);transition:transform .2s,box-shadow .2s" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">${ICONS.bolt} DEPLOY ${modeLabel}</button>
</div>`;
    }

    window.startPlayMode=function(){
        state.step='play';
        document.getElementById('story-overlay').style.display='none';
        document.getElementById('game-stage').style.display='grid';
        const pb=document.getElementById('progress-bar'); if(pb)pb.style.width='50%';
        const pl=document.getElementById('progress-label'); if(pl)pl.innerText='50%';
        const av=document.getElementById('mascot-avatar'); if(av)av.src=ASSETS.byteBook;
        speak("Let's hack! Inspect the target and modify client-side controls.");
        renderPlayPhase();
    };

    function renderPlayPhase(){renderLeftCard();renderRightControls()}

    function renderLeftCard(){
        const data = getRoomData();
        const panel = document.getElementById('left-play-panel');
        if (!panel) return;
        panel.innerHTML = `
<div style="text-align:center;max-width:440px;width:100%;animation:popIn .5s forwards">
    <div style="font-size:2.5rem;margin-bottom:12px">${WORLDS[state.world]?.icon || '🎯'}</div>
    <h2 style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;margin-bottom:4px">${data.title}</h2>
    <p style="color:var(--secondary);font-size:.85rem;margin-bottom:24px;line-height:1.5">${data.desc}</p>
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:20px;margin-bottom:16px">
        <div style="font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--primary);margin-bottom:8px">Challenge Target</div>
        <div id="challenge-target" style="font-family:monospace;font-size:.85rem;color:var(--text);line-height:1.6">
            🔍 Inspect this page using DevTools (F12).<br>
            Look for hidden elements, disabled controls,<br>
            or modifiable values in the DOM.
        </div>
    </div>
</div>`;
    }

    function renderRightControls(){
        const data = getRoomData();
        const panel = document.getElementById('right-control-panel');
        if (!panel) return;
        panel.innerHTML = `
<div style="display:flex;flex-direction:column;gap:16px;animation:slideFadeIn .5s forwards">
    <div style="background:#eef2ff;border:1px solid #c7d2fe;border-radius:16px;padding:16px">
        <div style="display:flex;gap:10px;align-items:flex-start">
            <span style="width:24px;height:24px;background:var(--primary);color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.7rem;flex-shrink:0">!</span>
            <div>
                <span style="font-weight:800;font-size:.8rem;color:var(--primary)">Objective</span>
                <p style="font-size:.8rem;color:#4338ca;margin-top:2px;line-height:1.4">${data.objective}</p>
            </div>
        </div>
    </div>
    <div style="background:var(--bg);border:1px solid var(--border);border-radius:16px;padding:16px">
        <span style="font-weight:800;font-size:.75rem;color:var(--secondary);text-transform:uppercase">Hints</span>
        <ul style="margin:8px 0 0 16px;font-size:.8rem;color:var(--secondary);line-height:1.6">
            <li>Open DevTools with <strong>F12</strong> or <strong>Ctrl+Shift+I</strong></li>
            <li>Use the <strong>Elements</strong> tab to inspect the page</li>
            <li>Try the <strong>Console</strong> to run JavaScript</li>
            <li>Check <strong>Application → Cookies</strong> for stored data</li>
        </ul>
    </div>
</div>`;
        // Add log
        const log = document.getElementById('terminal-logs');
        if (log) log.innerHTML += '<div class="log-row info">&gt; Challenge loaded. Awaiting your exploit...</div>';
    }

    console.log('[ByteLab Engine v3] Loaded for W'+state.world+'L'+state.level+' mode:'+state.mode);
})();
