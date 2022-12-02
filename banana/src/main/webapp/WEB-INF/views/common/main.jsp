<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>





<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="shortcut icon" sizes="16x16 32x32 64x64" href="https://i.ibb.co/4tCGZqD/Banana.png">

    <title>바꾸고 나누자 나랑: 바나나 마켓</title>

    <link rel="stylesheet" href="/resources/css/screens/main.css">
    <link rel="stylesheet" href="/resources/css/style.css">
    <script src="https://kit.fontawesome.com/f7459b8054.js" crossorigin="anonymous"></script>
    <script src="https://kit.fontawesome.com/1023652dd4.js" crossorigin="anonymous"></script>

</head>
<body>
    

    <main>

		<jsp:include page="/WEB-INF/views/common/header.jsp" />
		<jsp:include page="/WEB-INF/views/common/nav.jsp" />
        
        <section class="content"> 
            
            <section class="slider">
                <input type="radio" name="slide" class="slide" id="slide1" checked>
                <input type="radio" name="slide" class="slide" id="slide2">
                <input type="radio" name="slide" class="slide" id="slide3">
                <input type="radio" name="slide" class="slide" id="slide4">
                <input type="radio" name="slide" class="slide" id="slide5">
                
                <ul id="imgHolder" class="imgs">
                    <li><img src="/resources/images/mainAdd/main-add1.jpg" class="slide-img"></li>
                    <li><img src="/resources/images/mainAdd/main-add2.jpg" class="slide-img"></li>
                    <li><img src="/resources/images/mainAdd/main-add3.jfif" class="slide-img"></li>
                    <li><img src="/resources/images/mainAdd/main-add4.jpg" class="slide-img"></li>
                    <li><img src="/resources/images/mainAdd/main-add5.jpg" class="slide-img"></li>
                </ul>
                <div class="bullets">
                    <label for="slide1">&nbsp;</label>
                    <label for="slide2">&nbsp;</label>
                    <label for="slide3">&nbsp;</label>
                    <label for="slide4">&nbsp;</label>
                    <label for="slide5">&nbsp;</label>
                </div>
            </section>

            <section class="content-comment first">
                <div>
                    <i class="fa-solid fa-face-laugh-squint"></i>
                    <p class="title">  인기 상품</p>
                </div>
                
                <a href="#">더보기</a>
            </section>



            <section class="content-favorite" id="favorite">
                <c:forEach var="favorite" items="${favoriteGoodsList}">

                    <c:set var="i"  value="${i+1}"/>

                    <%-- 로그인상태인 경우 회원번호 가져와 like list 가져와 goods테이블에 대입(-) --%>
                    <c:if test="${favorite.isLike == 1}">
                        <c:set var="isLike" value="choose"/>
                    </c:if>

                    <div class="favorite__pack">
                        <div>
                            <div class="favorite__img">
                                <%-- <a href="/goods/goodsList/${favorite.goodsNo}"> --%>
                                <a href="">
                                    <img src="${favorite.thumbnail}" class="favorite__img">
                                </a>
                                <div class="favorite__heart">
                                    <input type="checkbox" id="like${i}" class="favorite__heart likeChk" value="${favorite.goodsNo}">
                                    <label for="like${i}" class="like_yn">
                                        <i class="fa-solid fa-heart heart ${isLike}"></i>
                                    </label>
                                </div>
                            </div>
                            <div class="favorite__price-heart">
                                <div class="favorite__price">${favorite.sellPrice}</div>
                            </div>
                        </div>
                    
                        <div class="favorite__title">${favorite.title}</div>
                    </div>

                    <c:remove var="isLike"/>
                </c:forEach>
            </section>
            


            <section class="content-comment second">
                
                <div>
                    <i class="fa-solid fa-seedling"></i>
                    <p class="title">  최근글</p>
                </div>
                
                <a href="#">더보기</a>
            </section>



            <section class="content-favorite">
                <c:forEach var="newGoods" items="${newGoodsList}">

                    <c:set var="i"  value="${i+1}"/>
                    
                    <c:if test="${newGoods.isLike == 1}">
                        <c:set var="isLike" value="choose"/>
                    </c:if>
                    <div class="favorite__pack">
                        <div>
                            <div class="favorite__img">
                                <a href="">
                                    <img src="${newGoods.thumbnail}" class="new__img">
                                </a>
                                <div class="favorite__heart">
                                    <input type="checkbox"  id="like${i}" class="new__heart likeChk" value="${newGoods.goodsNo}">
                                    <label for="like${i}" class="like_yn">
                                        <i class="fa-solid fa-heart heart"></i>
                                    </label>
                                </div>
                            </div>
                            <div class="favorite__price-heart">
                                <div class="new__price">${newGoods.sellPrice}</div>
                                
                            </div>
                        </div>
                    
                        <div class="new__title">${newGoods.title}</div>
                    </div>
                </c:forEach>
            </section>

        </section>
    </main>


    <script>
        const loginMember = "${loginMember}"
        const memberNo = "${loginMember.memberNo}";
        // const goodsNo = "${loginMember.goodsNo}";
    
    </script>


    <!-- jQuery CDN 방식으로 추가-->
    <script src="https://code.jquery.com/jquery-3.6.1.min.js" integrity="sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ=" crossorigin="anonymous"></script>






	<jsp:include page="/WEB-INF/views/common/footer.jsp"/>

    <script src="/resources/js/main.js"></script>

</body>
</html>