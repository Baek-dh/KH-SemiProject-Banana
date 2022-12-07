-- 테이블 삭제 
DROP SEQUENCE SEQ_ROOM_NO;
DROP SEQUENCE SEQ_MESSAGE_NO;

DROP TABLE MESSAGE;
DROP TABLE CHATTING_ROOM;

-- 테이블 등록
-- 채팅
CREATE TABLE "CHATTING_ROOM" (
   "CHATTING_NO"   NUMBER      NOT NULL,
   "CH_CREATE_DATE"   DATE   DEFAULT SYSDATE   NOT NULL,
   "GOODS_NO"	NUMBER	NOT NULL,
   "OPEN_MEMBER"   NUMBER      NOT NULL,
   "PARTICIPANT"   NUMBER      NOT NULL
);

COMMENT ON COLUMN "CHATTING_ROOM"."CHATTING_NO" IS '채팅방 번호';
COMMENT ON COLUMN "CHATTING_ROOM"."CH_CREATE_DATE" IS '채팅방 생성일';
COMMENT ON COLUMN "CHATTING_ROOM"."GOODS_NO" IS '판매글번호';
COMMENT ON COLUMN "CHATTING_ROOM"."OPEN_MEMBER" IS '개설자 회원 번호(로그인 본인)';
COMMENT ON COLUMN "CHATTING_ROOM"."PARTICIPANT" IS '참여자 회원 번호(판매자)';


--pk
ALTER TABLE "CHATTING_ROOM" 
ADD CONSTRAINT "PK_CHATTING_ROOM" 
PRIMARY KEY ("CHATTING_NO");

-- fk
--판매글 번호
ALTER TABLE "CHATTING_ROOM" 
ADD CONSTRAINT "FK_GOODS_SELL_TO_CHAT_ROOM_1" 
FOREIGN KEY ("GOODS_NO")
REFERENCES "GOODS_SELL" ("GOODS_NO");

-- 개설자 회원(로그인한 본인)
ALTER TABLE "CHATTING_ROOM" 
ADD CONSTRAINT "FK_OPEN_MEMBER" 
FOREIGN KEY ("OPEN_MEMBER") 
REFERENCES "MEMBER" ("MEMBER_NO");

-- 참여자 회원(판매자)
ALTER TABLE "CHATTING_ROOM" 
ADD CONSTRAINT "FK_PARTICIPANT" 
FOREIGN KEY ("PARTICIPANT") 
REFERENCES "MEMBER" ("MEMBER_NO");




CREATE TABLE "MESSAGE" (
   "MESSAGE_NO"   NUMBER      NOT NULL,
   "MESSAGE_CONTENT"   VARCHAR2(4000)      NOT NULL,
   "READ_FL"   CHAR   DEFAULT 'N'   NOT NULL,
   "SEND_TIME"   DATE   DEFAULT SYSDATE   NOT NULL,
   "SENDER_NO"   NUMBER      NOT NULL,
   "CHATTING_NO"   NUMBER      NOT NULL
);

COMMENT ON COLUMN "MESSAGE"."MESSAGE_NO" IS '메세지 번호';
COMMENT ON COLUMN "MESSAGE"."MESSAGE_CONTENT" IS '메세지 내용';
COMMENT ON COLUMN "MESSAGE"."READ_FL" IS '읽음 여부';
COMMENT ON COLUMN "MESSAGE"."SEND_TIME" IS '메세지 보낸 시간';
COMMENT ON COLUMN "MESSAGE"."SENDER_NO" IS '보낸 회원의 번호';
COMMENT ON COLUMN "MESSAGE"."CHATTING_NO" IS '채팅방 번호';

ALTER TABLE "MESSAGE" ADD CONSTRAINT "PK_MESSAGE" PRIMARY KEY (
   "MESSAGE_NO"
);


ALTER TABLE "MESSAGE" 
ADD CONSTRAINT "FK_CHATTING_NO" 
FOREIGN KEY ("CHATTING_NO") REFERENCES "CHATTING_ROOM";

ALTER TABLE "MESSAGE" 
ADD CONSTRAINT "FK_SENDER_NO" 
FOREIGN KEY ("SENDER_NO") REFERENCES "MEMBER";

-- 시퀀스 생성
CREATE SEQUENCE SEQ_ROOM_NO NOCACHE;
CREATE SEQUENCE SEQ_MESSAGE_NO NOCACHE;

---------------------------------------------------------------------

-- 채팅방 확인
  SELECT NVL(SUM(CHATTING_NO),0) CHATTING_NO
  FROM CHATTING_ROOM
  WHERE (OPEN_MEMBER = 12 AND PARTICIPANT = 11)
  OR (OPEN_MEMBER = 11 AND PARTICIPANT = 12)
  
-- 채팅방 중복 확인 

	SELECT NVL(SUM(CHATTING_NO),0) CHATTING_NO
  FROM CHATTING_ROOM
  WHERE (OPEN_MEMBER = #{loginMemberNo} AND PARTICIPANT = #{targetNo} AND GOODS_NO=#{goodsNo})
  OR (OPEN_MEMBER = #{targetNo} AND PARTICIPANT = #{loginMemberNo},AND GOODS_NO=#{goodsNo})

  
-- 채팅방 생성  
 INSERT INTO CHATTING_ROOM 
VALUES (SEQ_ROOM_NO.NEXTVAL,DEFAULT, 9 ,34,1)

-- 내가 판매중인 상품 조회
SELECT * FROM GOODS_SELL
WHERE SELLER_NO =1
AND BUYER_NO IS NULL;


SELECT * FROM CHATTING_ROOM;
SELECT * FROM MESSAGE;
COMMIT;
ROLLBACK;


-- 상품 정보 조회 ( 제목, 판매금액, 상태, 이미지)
 SELECT TITLE, SELL_PRICE, NVL2(BUYER_NO,'판매완료','판매중')BUYER_NO, IMAGE_PATH
 FROM GOODS_SELL
 JOIN GOODS_IMAGE USING(GOODS_NO)
 WHERE GOODS_NO= 9;


-- 참여중인 채팅방 목록 조회
 SELECT CHATTING_NO
         ,(SELECT MESSAGE_CONTENT FROM (
            SELECT * FROM MESSAGE M2
            WHERE M2.CHATTING_NO = R.CHATTING_NO
            ORDER BY MESSAGE_NO DESC) 
            WHERE ROWNUM = 1) LAST_MESSAGE
         ,CASE  
 		  WHEN SYSDATE-TO_DATE(TO_CHAR( (NVL((SELECT MAX(SEND_TIME) SEND_TIME
	       FROM MESSAGE M
           WHERE R.CHATTING_NO  = M.CHATTING_NO), CH_CREATE_DATE))+1,'YYYY-MM-DD') ) < 0
	      THEN TO_CHAR (NVL((SELECT MAX(SEND_TIME) SEND_TIME
               FROM MESSAGE M
               WHERE R.CHATTING_NO  = M.CHATTING_NO), CH_CREATE_DATE), 'PM HH24:MI')
	      ELSE TO_CHAR(NVL((SELECT MAX(SEND_TIME) SEND_TIME
               FROM MESSAGE M
               WHERE R.CHATTING_NO  = M.CHATTING_NO), CH_CREATE_DATE), 'YYYY.MM.DD')
       END SEND_TIME
         ,NVL2((SELECT OPEN_MEMBER FROM CHATTING_ROOM R2
            WHERE R2.CHATTING_NO = R.CHATTING_NO
            AND R2.OPEN_MEMBER = 34),
            R.PARTICIPANT,
            R.OPEN_MEMBER
            ) TARGET_NO   
         ,NVL2((SELECT OPEN_MEMBER FROM CHATTING_ROOM R2
            WHERE R2.CHATTING_NO = R.CHATTING_NO
            AND R2.OPEN_MEMBER = 34),
            (SELECT MEMBER_NICKNAME FROM MEMBER WHERE MEMBER_NO = R.PARTICIPANT),
            (SELECT MEMBER_NICKNAME FROM MEMBER WHERE MEMBER_NO = R.OPEN_MEMBER)
            ) TARGET_NICKNAME   
         ,NVL2((SELECT OPEN_MEMBER FROM CHATTING_ROOM R2
            WHERE R2.CHATTING_NO = R.CHATTING_NO
            AND R2.OPEN_MEMBER = 34),
            (SELECT PROFILE_IMG FROM MEMBER WHERE MEMBER_NO = R.PARTICIPANT),
            (SELECT PROFILE_IMG FROM MEMBER WHERE MEMBER_NO = R.OPEN_MEMBER)
            ) TARGET_PROFILE
         ,(SELECT COUNT(*) FROM MESSAGE M WHERE M.CHATTING_NO = R.CHATTING_NO AND READ_FL = 'N' AND SENDER_NO != 34) NOT_READ_COUNT
         ,(SELECT MAX(MESSAGE_NO) SEND_TIME FROM MESSAGE M WHERE R.CHATTING_NO  = M.CHATTING_NO) MAX_MESSAGE_NO
      FROM CHATTING_ROOM R
      WHERE OPEN_MEMBER = 34
      OR PARTICIPANT = 34
      ORDER BY MAX_MESSAGE_NO DESC NULLS LAST;
     
     
--------------------------------------------------------------------------------------


SELECT SEND_TIME, SYSDATE-TO_DATE(TO_CHAR( SEND_TIME+1,'YYYY-MM-DD') )  FROM MESSAGE


