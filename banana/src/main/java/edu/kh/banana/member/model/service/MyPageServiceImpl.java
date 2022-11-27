package edu.kh.banana.member.model.service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.kh.banana.goods.model.vo.GoodsSell;
import edu.kh.banana.member.model.dao.MyPageDAO;
import edu.kh.banana.member.model.vo.Member;
import edu.kh.project.board.model.vo.Board;

@Service
public class MyPageServiceImpl implements MyPageService{
	
	@Autowired
	private MyPageDAO dao;
	
	@Autowired
	private BCryptPasswordEncoder bcrypt;

	
	// 마이페이지 자기소개 수정 
	@Override
	public int changeIntroduce(Member member) {
		return dao.changeIntroduce(member);
	}

	
	// 내 회원 정보 수정
	@Override
	@Transactional(rollbackFor = Exception.class)
	public int updateInfo(Member inputMember) {
		
		int result = -1;
		
		if (inputMember.getMemberPw().equals("")) {
			result = dao.updateInfoNoPw(inputMember);
		}else {
			// 비밀번호 암호화
			String encPw = bcrypt.encode(inputMember.getMemberPw());
			inputMember.setMemberPw(encPw);
			 result =  dao.updateInfoPw(inputMember);
		}
		
		
		
		return result;
	}

	// 판매완료한 내 게시글 목록 조회
	@Override
	public Map<String, Object> selectGoodsSoldList(int memberNo) {
		
		// 1단계 : 특정 게시판의 전체 게시글 수를 조회한다(단, 삭제된 글 제외)
		//int listCount = dao.getListCount(memberNo);
		
		List<GoodsSell> soldList = dao.selectGoodsSoldList(memberNo);
		System.out.println(soldList);
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("SoldList", soldList);
		
		return map;
		
		
		
	}

	

}
