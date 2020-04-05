package com.example.Betting.service;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.Betting.model.TicketOdds;
import com.example.Betting.repository.TicketOddsRepository;

@Service
public class TicketOddsService {

	@Autowired
	private TicketOddsRepository ticketOddsRepository;
	
	
	public Collection<TicketOdds> findAllPlayedTicketPairs(){
		return ticketOddsRepository.findAll(Sort.by(Sort.Direction.DESC, "odds.match.matchdate"));
	}
	
	public void createTicketOddsPair(TicketOdds ticketOdd) {
		ticketOddsRepository.save(ticketOdd);
	}
	
	public Collection<TicketOdds> findAllPlayedPairsByTicketId(long ticketId){
		return ticketOddsRepository.findAllByTicket_id(ticketId);
	}
	
}
