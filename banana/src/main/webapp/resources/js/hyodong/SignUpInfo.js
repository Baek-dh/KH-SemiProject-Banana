const checkObj = {
    "memberEmail"   : false,
    "memberPw"      : false,
    "memberPwConfirm" : false,
    "memberNickname" : false,
    "memberBirth" : false,
    "memberTel" : false,
    "memberEmailCertification" : false,
    "memberAddress" : false
}
// 회원 가입 양식이 제출 되었을 때
document.getElementById("signUp-frm").addEventListener("submit",function(event){

    for(let key in checkObj){

        let str;

        if(!checkObj[key]){

            switch(key){
                case "memberEmail"              : str = "이메일이 유효하지 않습니다.";        break;
                case "memberPw"                 : str = "비밀번호가 유효하지 않습니다.";      break;
                case "memberPwConfirm"          : str = "비밀번호 확인이 유효하지 않습니다."; break;
                case "memberNickname"           : str = "닉네임이 유효하지 않습니다.";        break;
                case "memberBirth"              : str = "생년월일이 유효하지 않습니다.";      break;
                case "memberTel"                : str = "전화번호가 유효하지 않습니다.";      break;
                case "memberEmailCertification" : str = "인증이 완료되지 않았습니다.";        break;
                case "memberAddress"            : str = "주소가 유효하지 않습니다.";          break;
            }
            alert(str);
            document.getElementById(key).focus();
            event.preventDefault(); // 제출 이벤트 제거
            return; 
        }
    }
})

/*************************** 이메일 유효성 검사 ***************************/
const memberEmail = document.getElementById("memberEmail");
const emailMessage = document.getElementById("emailMessage");

memberEmail.addEventListener("input",()=>{

    // 미입력시
    if(memberEmail.value.trim().length == 0){
        emailMessage.innerText="인증번호를 받을 수 있는 이메일을 입력해주세요.";
        emailMessage.classList.remove("confirm","error");
        memberEmail.value="";
        checkObj.memberEmail = false;
        return;
    }

    // 정규표현식
    const regEx = /^[A-Za-z\d\-\_]{4,}@[\w\-\_]+(\.\w+){1,3}$/;
    
    if(regEx.test(memberEmail.value)){ // 유효할때
        $.ajax({
            url : "/emailDupCheck",
            data : {"memberEmail" : memberEmail.value}, 
            success : (result) => {
                if(result == 0) {// 중복 아닐떄
                    emailMessage.innerText="사용 가능한 이메일 입니다."
                    emailMessage.classList.remove("error")
                    emailMessage.classList.add("confirm")
                    checkObj.memberEmail = true;

                }else{// 중복 일떄
                    emailMessage.innerText="이미 사용중인 이메일 입니다."
                    emailMessage.classList.remove("confirm")
                    emailMessage.classList.add("error")
                    checkObj.memberEmail = false;
                }
            }, 
            error : () => { 
                console.log("이메일 ajax 중복검사 실패");
            },
            complete : () => {
                console.log("이메일 ajax 중복검사 완료");
            },
        });

    } else { //유효하지 않은 경우
        emailMessage.innerText = "이메일 형식이 유효하지 않습니다.";
        emailMessage.classList.remove("confirm");
        emailMessage.classList.add("error");
        checkObj.memberEmail = false;
    }
});

/*************************** 비밀번호/비밀번호 확인 유효성 검사 ***************************/
const memberPw = document.getElementById("memberPw");
const memberPwConfirm =document.getElementById("memberPwConfirm");
const pwMessage = document.getElementById("pwMessage");

// 비밀번호 유효성 검사
memberPw.addEventListener("input",()=>{

    // 비밀번호 미입력 시
    if(memberPw.value.trim().length == 0){
        pwMessage.innerText ="영문자/숫자/특수문자 포함 8~16글자 사이로 입력해주세요.";
        pwMessage.classList.remove("confirm","error");
        memberPw.value="";
        checkObj.memberPw = false;
        return;
    }

    // 비밀번호 정규 표현식
    const regEx =/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[`~!@$!%*#^?&\\(\\)\\-_=+])(?!.*[^a-zA-z0-9`~!@$!%*#^?&\\(\\)\\-_=+]).{8,16}$/;
    
    if(regEx.test(memberPw.value)){ // 정규표현식이 일치할경우
        checkObj.memberPw = true;

        // 비밀번호 확인 미 작성시
        if(memberPwConfirm.value.trim().length == 0){
            pwMessage.innerText="유효한 비밀번호 형식입니다";
            pwMessage.classList.remove("error");
            pwMessage.classList.add("confirm");

        } else { // 유효한 비밀번호 == 비밀번호 확인 동일한지 확인

            if(memberPw.value == memberPwConfirm.value){ // 동일한 경우
                pwMessage.innerText ="비밀번호가 일치합니다.";
                pwMessage.classList.remove("error");
                pwMessage.classList.add("confirm");
                checkObj.memberPwConfirm = true;

            } else { // 동일하지 않은 경우
                pwMessage.innerText = "비밀번호가 일치하지 않습니다.";
                pwMessage.classList.remove("confirm");
                pwMessage.classList.add("error");
                checkObj.memberPwConfirm = false;
            }
        }

    } else { // 정규표현식이 일치하지 않을 경우
        pwMessage.innerText="비밀번호 형식이 유효하지 않습니다.";
        pwMessage.classList.remove("confirm");
        pwMessage.classList.add("error");
        checkObj.memberPw = false;
    }
});

// 비밀번호 확인 유효성 검상
memberPwConfirm.addEventListener("input",()=>{

    // 정규표현식이 일치할경우
    if(checkObj.memberPw){

        if(memberPw.value == memberPwConfirm.value){ // 동일한 경우
            pwMessage.innerText="비밀번호가 일치합니다.";
            pwMessage.classList.remove("error");
            pwMessage.classList.add("confirm");
            checkObj.memberPwConfirm = true;

        } else { // 동일하지 않을 경우
            pwMessage.innerText="비밀번호가 일치하지 않습니다.";
            pwMessage.classList.remove("confirm");
            pwMessage.classList.add("error");
            checkObj.memberPwConfirm = false;
        }

    }else{ // 정규표현식이 일치하지 않을 경우
        checkObj.memberPwConfirm = false;
    }
})

/*************************** 닉네임 확인 유효성 검사 ***************************/
const memberNickname = document.getElementById("memberNickname");
const nickMessage = document.getElementById("nickMessage");

memberNickname.addEventListener("input",()=>{

    // 닉네임 미입력 시
    if(memberNickname.value.trim().length == 0){
        nickMessage.innerText="한글,영어,숫자로만 2~10글자 사이로 입력해주세요.";
        nickMessage.classList.remove("confirm","error");
        checkObj.memberNickname= false;
        return;
    }
    // 닉네임 정규 표현식
    const regEx =/^[가-힣\w]{2,10}$/;

    if(regEx.test(memberNickname.value)){ // 정규표현식 일치하는 경우

        // 닉네임 중복검사
        const dbNicknameCheck = {"memberNickname":memberNickname.value};

        $.ajax({
            url  : '/nicknameDupCheck',
            data : dbNicknameCheck,
            success : (result)=>{

                if(result == 0){ // 중복된 닉네임이 없다면
                    nickMessage.innerText="유효한 닉네임 형식 입니다.";
                    nickMessage.classList.remove("error");
                    nickMessage.classList.add("confirm");
                    checkObj.memberNickname=true;

                }else{ // 중복된 닉네임이 있다면
                    nickMessage.innerText="이미 사용중인 닉네임 입니다.";
                    nickMessage.classList.remove("confirm");
                    nickMessage.classList.add("error");
                    checkObj.memberNickname = false;
                }
            },
            error : ()=>{
                console.log("닉네임 ajax 중복검사 실패");
            },
            complete : ()=>{
                console.log("닉네임 ajax 중복검사 완료");
            }
        });

    } else { // 정규표현식 일치하지 않은 경우
        nickMessage.innerText="유효한 닉네임 형식이 아닙니다.";
        nickMessage.classList.remove("confirm");
        nickMessage.classList.add("error");
        checkObj.memberNickname= false;
    }
});

/*************************** 생년월일 유효성 검사 ***************************/
const memberBirth = document.getElementById("memberBirth");
const birthMessage = document.getElementById("birthMessage");

memberBirth.addEventListener("input",()=>{

    // 생년월일 미 입력시
    if(memberBirth.value.trim().length == 0){
        birthMessage.innerText="숫자로 생년월일 8자리를 입력해주세요.";
        birthMessage.classList.remove("confirm","error");
        checkObj.memberBirth = false;
        return;
    }

    //생년월일 정규표현식 검사
    const regEx =/^[\d]{8}$/;

    if(regEx.test(memberBirth.value)){ // 정규표현식이 일치한 경우
        birthMessage.innerText="유효한 생년월일 형식 입니니다.";
        birthMessage.classList.remove("error");
        birthMessage.classList.add("confirm");
        checkObj.memberBirth = true;
    } else { // 정규표현식이 일치 하지 않는 경우
        birthMessage.innerText="유효하지 않은 생년월일 형식 입니다.";
        birthMessage.classList.remove("confirm");
        birthMessage.classList.add("error");
        checkObj.memberBirth = false;
    }
});

/*************************** 전화번호 유효성 검사 ***************************/
const memberTel = document.getElementById("memberTel");
const temlMessage = document.getElementById("temlMessage");

memberTel.addEventListener("input",()=>{

    // 전화번호 미 입력시
    if(memberTel.value.trim().length == 0){
        temlMessage.innerText="전화번호를 입력해 주세요.(-제외)";
        temlMessage.classList.remove("confirm","error");
        checkObj.memberTel = false;
        return;
    } 

    // 전화번호 정규표현식
    const regEx = /^0(1[01679]|2|[3-6][1-5]|70)[1-9]\d{2,3}\d{4}$/;

    if(regEx.test(memberTel.value)){ // 정규표현식이 일치한 경우
        const dbTelCheck ={"memberTel":memberTel.value};
            
            $.ajax({
                url :"/telDupCheck",
                data: dbTelCheck,
                success : (result)=>{
                    if(result == 0){ // 중복된 전화번호가 없다면
                        temlMessage.innerText="사용 가능한 전화번호 입니다.";
                        temlMessage.classList.remove("error");
                        temlMessage.classList.add("confirm")
                        checkObj.memberTel = true;

                    } else { // 중복된 전화번호가 있다면
                        temlMessage.innerText="이미 사용중인 전화번호 입니다.";
                        temlMessage.classList.remove("confirm");
                        temlMessage.classList.add("error");
                        checkObj.memberTel = false;
                    }

                },
                error : ()=>{
                    console.log("전화번호 ajax 중복검사 실패");
                },
                complete : ()=>{
                    console.log("전화번호 ajax 중복검사 완료");
                }
            });

    } else { // 정규표현식이 일치하지 않는 경우
        temlMessage.innerText="전화번호 형식이 유효하지 않습니다.";
        temlMessage.classList.remove("confirm");
        temlMessage.classList.add("error");
        checkObj.memberTel = false;
    }
})


/*************************** 주소 유효성 검사 ***************************/
const sample6_postcode = document.getElementById("sample6_postcode");
const sample6_address = document.getElementById("sample6_address");
const addMessage = document.getElementById("addMessage");

const sample6_detailAddress = document.getElementById("sample6_detailAddress");

/* 주소검색 api */
function sample6_execDaumPostcode() {
    new daum.Postcode({
        oncomplete: function(data) {
            // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

            // 각 주소의 노출 규칙에 따라 주소를 조합한다.
            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
            var addr = ''; // 주소 변수

            //사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
            if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
                addr = data.roadAddress;
            } else { // 사용자가 지번 주소를 선택했을 경우(J)
                addr = data.jibunAddress;
            }

            // 우편번호와 주소 정보를 해당 필드에 넣는다.
            sample6_postcode.value = data.zonecode;
            sample6_address.value = addr;


            // 우편번호 미 입력시
            if(sample6_postcode.value.trim().length == 0){
                addMessage.innerText="검색을 눌러 주소를 입력해 주세요.";
                addMessage.classList.remove("confirm","error");
                checkObj.memberAddress = false;
                return;
            }
            // 우편번호 정규표현식
            const regEx = /^\d{5}$/;
            
             if(regEx.test(sample6_postcode.value)){ // 정규표현식이 일치한 경우
            addMessage.innerText="우편번호 형식이 일치합니다.";
            addMessage.classList.remove("error");
            addMessage.classList.add("confirm")
            checkObj.memberAddress = true;

                // 도로명/ 지번 주소 미 입력시
                if(sample6_address.value.trim().length == 0){
                    addMessage.innerText="검색을 눌러 주소를 입력해 주세요.";
                    addMessage.classList.remove("confirm","error");
                    checkObj.memberAddress = false;
                    return;
                }
                // 도로명/지번 정규표현식
                const regEx = /^[서울]{2}\s[ㄱ-힣]{2,3}[구]\s[가-힣\d]+\s[\d\-]+/;

                if(regEx.test(sample6_address.value)){ // 정규표현식 일치한 경우
                    addMessage.innerText="도로명/지번 형식이 일치합니다.";
                    addMessage.classList.remove("error");
                    addMessage.classList.add("confirm")
                    checkObj.memberAddress = true;

                }else {
                    addMessage.innerText="도로명/지번 형식이 일치하지 않습니다.";
                    addMessage.classList.remove("confirm");
                    addMessage.classList.add("error");
                    checkObj.memberAddress = false;
                }

            } else { // 정규표현식이 일치하지 않는 경우
                addMessage.innerText="우편번호 형식이 일치하지 않습니다.";
                addMessage.classList.remove("confirm");
                addMessage.classList.add("error");
                checkObj.memberAddress = false;
            }

                // 커서를 상세주소 필드로 이동한다.
                document.getElementById("sample6_detailAddress").focus();
        }
    }).open();
}


sample6_postcode.addEventListener("input", ()=>{

    // 우편번호 미 입력시
    if(sample6_postcode.value.trim().length == 0){
        addMessage.innerText="검색을 눌러 주소를 입력해 주세요.";
        addMessage.classList.remove("confirm","error");
        checkObj.memberAddress = false;
        return;
    }
    // 우편번호 정규표현식
    const regEx = /^\d{5}$/;
    
    if(regEx.test(sample6_postcode.value)){ // 정규표현식이 일치한 경우
        addMessage.innerText="우편번호 형식이 일치합니다.";
        addMessage.classList.remove("error");
        addMessage.classList.add("confirm")
        checkObj.memberAddress = true;

        // 도로명/ 지번 주소 미 입력시
        if(sample6_address.value.trim().length == 0){
            addMessage.innerText="검색을 눌러 주소를 입력해 주세요.";
            addMessage.classList.remove("confirm","error");
            checkObj.memberAddress = false;
            return;
        }
        // 도로명/지번 정규표현식
        const regEx = /^[서울]{2}\s[ㄱ-힣]{2,3}[구]\s[가-힣\d]+\s[\d\-]+/;

        if(regEx.test(sample6_address.value)){ // 정규표현식 일치한 경우
            addMessage.innerText="도로명/지번 형식이 일치합니다.";
            addMessage.classList.remove("error");
            addMessage.classList.add("confirm")
            checkObj.memberAddress = true;

        }else {
            addMessage.innerText="도로명/지번 형식이 일치하지 않습니다.";
            addMessage.classList.remove("confirm");
            addMessage.classList.add("error");
            checkObj.memberAddress = false;
        }

    } else { // 정규표현식이 일치하지 않는 경우
        addMessage.innerText="우편번호 형식이 일치하지 않습니다.";
        addMessage.classList.remove("confirm");
        addMessage.classList.add("error");
        checkObj.memberAddress = false;
    }
});

sample6_address.addEventListener("input",()=>{

    // 도로명/ 지번 주소 미 입력시
    if(sample6_address.value.trim().length == 0){
        addMessage.innerText="검색을 눌러 주소를 입력해 주세요.";
        addMessage.classList.remove("confirm","error");
        checkObj.memberAddress = false;
        return;
    }
    // 도로명/지번 정규표현식
    const regEx = /^[서울]{2}\s[ㄱ-힣]{2,3}[구]\s[가-힣\d]+\s[\d\-]+/;

    if(regEx.test(sample6_address.value)){ // 정규표현식 일치한 경우
        addMessage.innerText="도로명/지번 형식이 일치합니다.";
        addMessage.classList.remove("error");
        addMessage.classList.add("confirm")
        checkObj.memberAddress = true;


        // 우편번호 미 입력시
        if(sample6_postcode.value.trim().length == 0){
            addMessage.innerText="검색을 눌러 주소를 입력해 주세요.";
            addMessage.classList.remove("confirm","error");
            checkObj.memberAddress = false;
            return;
        }
            // 우편번호 정규표현식
        const regEx = /^\d{5}$/;
        
        if(regEx.test(sample6_postcode.value)){ // 정규표현식이 일치한 경우
            addMessage.innerText="우편번호 형식이 일치합니다.";
            addMessage.classList.remove("error");
            addMessage.classList.add("confirm")
            checkObj.memberAddress = true;

        } else { // 정규표현식이 일치하지 않는 경우
            addMessage.innerText="우편번호 형식이 일치하지 않습니다.";
            addMessage.classList.remove("confirm");
            addMessage.classList.add("error");
            checkObj.memberAddress = false;
        }

    }else {
        addMessage.innerText="도로명/지번 형식이 일치하지 않습니다.";
        addMessage.classList.remove("confirm");
        addMessage.classList.add("error");
        checkObj.memberAddress = false;
    }
});


/*************************** 이메일 인증번호 ***************************/

// 이메일 인증코드 발송 / 확인

// 인증번호 발송
const sendAuthKeyBtn = document.getElementById("sendAuthKeyBtn");
const authKeyMessage = document.getElementById("authKeyMessage");
let authTimer;
let authMin = 4;
let authSec = 59;

sendAuthKeyBtn.addEventListener("click", function(){
    authMin = 4;
    authSec = 59;
    checkObj.memberEmailCertification = false;

    if(checkObj.memberEmail){ // 중복이 아닌 이메일인 경우
        $.ajax({
            url : "/sendEmail/signUp",
            data : {"email": memberEmail.value},
            success : (result) => {
                if(result > 0){
                    console.log("인증 번호가 발송되었습니다.")
                }else{
                    console.log("인증번호 발송 실패")
                }
            }, error : () => {
                console.log("이메일 발송 중 에러 발생");
            }
        })
        alert("인증번호가 발송 되었습니다.");
        authKeyMessage.innerText = "05:00";
        authKeyMessage.classList.remove("confirm");


        authTimer = window.setInterval(()=>{

            authKeyMessage.innerText = "0" + authMin + ":" + (authSec<10 ? "0" + authSec : authSec);
            
            // 남은 시간이 0분 0초인 경우
            if(authMin == 0 && authSec == 0){
                checkObj.memberEmailCertification = false;
                clearInterval(authTimer);
                return;
            }

            // 0초인 경우
            if(authSec == 0){
                authSec = 60;
                authMin--;
            }
            authSec--; // 1초 감소
        }, 1000)

    } else{
        alert("중복되지 않은 이메일을 작성해주세요.");
        memberEmail.focus();
    }
});


// 인증 확인
const memberEmailCertification = document.getElementById("memberEmailCertification");
const checkAuthKeyBtn = document.getElementById("checkAuthKeyBtn");

checkAuthKeyBtn.addEventListener("click", function(){

    if(authMin > 0 || authSec > 0){ // 시간 제한이 지나지 않은 경우에만 인증번호 검사 진행

        $.ajax({
            url : "/sendEmail/checkAuthKey",
            data : {"inputKey": memberEmailCertification.value},
            success : (result) => {

                if(result > 0){
                    clearInterval(authTimer);
                    authKeyMessage.innerText = "인증되었습니다.";
                    authKeyMessage.classList.add("confirm");
                    checkObj.memberEmailCertification = true;

                } else{
                    alert("인증번호가 일치하지 않습니다.")
                    checkObj.memberEmailCertification = false;
                }
            }, 
            error : () => {
                console.log("인증코드 확인 오류");
            }
        })

    } else{
        alert("인증 시간이 만료되었습니다. 다시 시도해주세요.")
    }
});