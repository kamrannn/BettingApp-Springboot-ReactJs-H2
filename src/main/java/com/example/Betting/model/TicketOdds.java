package com.example.Betting.model;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Entity
@Data
@Table(name="ticket_odds")
public class TicketOdds {

    @EmbeddedId
    TicketOddsKey id;
    
    @ManyToOne
    @MapsId("ticket_id")
    @JoinColumn(name = "ticket_id")
    Ticket ticket;
 
    @ManyToOne
    @MapsId("odds_id")
    @JoinColumn(name = "odds_id")
    Odds odds;
 
    private float odd;
    
    private String type;
}
