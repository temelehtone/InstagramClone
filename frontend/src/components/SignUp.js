import { useState } from "react"
import { Form, Button } from "react-bootstrap"


export default function SignUp() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")

    function createAccount(e) {

    }

    function updateUsername(e) {
        setUsername(e.target.value)
    }
    function updateFirstname(e) {
        setFirstName(e.target.value)
    }
    function updateLastName(e) {
        setLastName(e.target.value)
    }

    return <Form className="">
        <Form.Group className="mb-4">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" onInput={updateUsername}/>
        </Form.Group>
        <Form.Group className="mb-4">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="FirstName" onInput={updateFirstname}/>
        </Form.Group>
        <Form.Group className="mb-4">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="LastName" onInput={updateLastName}/>
        </Form.Group>
        <Button variant="primary" type="button" onClick={createAccount}>Create Account</Button>
    </Form>
}