package edu.kh.banana.manager.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import edu.kh.banana.board.model.vo.Pagination;
import edu.kh.banana.goods.model.vo.GoodsSell;
import edu.kh.banana.manager.model.dao.ManagerDAO;
import edu.kh.banana.member.model.vo.Member;

@Service
public class ManagerServiceImpl implements ManagerService{
	
	@Autowired
	private ManagerDAO dao;
	
	@Autowired
	private BCryptPasswordEncoder bcrypt;

	@Override
	public Member login(Member inputManager) {
		
		Member loginManager = dao.login(inputManager.getMemberEmail());
		
		
		if(loginManager != null) {
			if(bcrypt.matches(inputManager.getMemberPw(), loginManager.getMemberPw())) {
				loginManager.setMemberPw(null);
			} else {
				loginManager = null;
			}
		}
		return loginManager;
	}

	/**
	 * 회원 목록 조회
	 */
	@Override
	public Map<String, Object> memberSearch(Map<String, Object> paramMap, int cp) {
		
		// 조건에 맞는 회원 수
		int listCount = dao.getMemberListCount(paramMap);
		
		// 전체 회원 수
		int allMemberCount = dao.memberCount();
		
		// 전체 회원 수 + cp를 이용헤 페이징 처리
		Pagination pagination = new Pagination(listCount, cp);
		pagination.setLimit(30); // 한 페이지에 보일 회원목록 수 : 30
		
		
		// sort값 계산
		paramMap.put("order", "M.MEMBER_NO ASC");
		if(paramMap.get("sort").equals("1")) {
			paramMap.put("order", "M.MEMBER_NO ASC");
		}
		if(paramMap.get("sort").equals("2")) {
			paramMap.put("order", "M.MEMBER_NO DESC");
		}
		if(paramMap.get("sort").equals("3")) {
			paramMap.put("order", "SELL_COUNT ASC, M.MEMBER_NO ASC");
		}
		if(paramMap.get("sort").equals("4")) {
			paramMap.put("order", "BUY_COUNT DESC, M.MEMBER_NO ASC");
		}
		
		// 조건에 맞는 회원 목록
		List<Member> memberList = dao.memberSearch(pagination, paramMap);
		

		
		Map<String, Object> map = new HashMap<>();
		map.put("pagination", pagination);
		map.put("memberList", memberList);
		map.put("allMemberCount", allMemberCount);
		map.put("listCount", listCount);
		
		return map;
	}

	/**
	 * 회원 정보 수정
	 */
	@Override
	public int memberEdit(Member member) {
		
		return dao.memberEdit(member);
	}

	/**
	 * 회원 정보 삭제
	 */
	@Override
	public int memberDelete(int memberNo) {
		
		return dao.memberDelete(memberNo);
	}
	
	
	/**
	 * 회원 차단
	 */
	@Override
	public int memberBlock(int memberNo) {
		
		return dao.memberBlock(memberNo);
	}

	/**
	 * 상품 목록 조회
	 */
	@Override
	public Map<String, Object> goodsSearch(Map<String, Object> paramMap, int cp) {
		
		// 조건에 맞는 상품 갯수 조회
		int listCount = dao.getGoodsListCount(paramMap);
		
		// 전체 상품 수
		int allGoodsCount = dao.allGoodsCount();
		
		// 전체 상품 수 + cp를 이용헤 페이징 처리
		Pagination pagination = new Pagination(listCount, cp);
		pagination.setLimit(30); // // 한 페이지에 보일 상품목록 수 : 30
		
		
		// sort값 계산
		paramMap.put("order", "GOODS_NO ASC");
		if(paramMap.get("sort").equals("1")) {
			paramMap.put("order", "GOODS_NO ASC");
		}
		if(paramMap.get("sort").equals("2")) {
			paramMap.put("order", "GOODS_NO DESC");
		}
		if(paramMap.get("sort").equals("3")) {
			paramMap.put("order", "SELL_PRICE ASC, GOODS_NO ASC");
		}
		if(paramMap.get("sort").equals("4")) {
			paramMap.put("order", "SELL_PRICE DESC, GOODS_NO ASC");
		}
		
		
		// 조건에 맞는 상품 목록
		List<GoodsSell> goodsList = dao.goodsSearch(pagination, paramMap);
		
		Map<String, Object> map = new HashMap<>();
		map.put("pagination", pagination);
		map.put("goodsList", goodsList);
		map.put("allGoodsCount", allGoodsCount);
		map.put("listCount", listCount);
		
		return map;
	}







}
