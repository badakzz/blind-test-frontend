import axios from 'axios'
import React, { CSSProperties, useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import { RoadmapTicket } from '../utils/types'

const RoadmapTicketsList: React.FC = () => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        axios
            .get(
                `${process.env.REACT_APP_SERVER_DOMAIN}:${process.env.REACT_APP_SERVER_PORT}/api/v1/roadmap_tickets`
            )
            .then((response) => {
                setTickets(response.data) // Axios already parses JSON
                setLoading(false)
            })
            .catch((error) => {
                console.error(
                    'An error occurred while fetching tickets:',
                    error
                )
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <div>Loading tickets...</div>
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center flex-column mt-5 p-5 yellow-container"
            style={styles.container}
        >
            <h4>Roadmap</h4>
            <ul>
                {tickets.map((ticket: RoadmapTicket) => (
                    <li key={ticket.ticketId}>
                        <h5>
                            {ticket.title} by {ticket.author}
                        </h5>
                        <p>{ticket.ticketContent}</p>
                    </li>
                ))}
            </ul>
        </Container>
    )
}

const styles: { [key: string]: CSSProperties } = {
    container: {
        minHeight: '20rem',
    },
}

export default RoadmapTicketsList
