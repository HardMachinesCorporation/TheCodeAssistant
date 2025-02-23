import React from "react";
import { Box, Button, Form, FormField, TextInput } from "grommet";

interface ChatInputPropos {
    onSubmit: (message:string) => void // update function signature to accept message string
    value:string
    onChange: (event: React.ChangeEvent<HTMLInputElement>)=> void // update onChage handler type
}

const ChatInput: React.FC<ChatInputPropos> = ({onSubmit, value,onChange }) => {
    return (

        <Form onSubmit={(event) => {
            onSubmit(event.value.toString())
        }}>
         <Box direction="row" gap="small">
            <FormField>
                <TextInput
                   placeholder="Enter your message..."
                   value={value}
                   onChange={onChange}
                   size="medium"
                   />
            </FormField>
            <Button
             primary
             type="submit"
             label="Send"
             disable={!value} // Disable button if no message entered
             >Send</Button>
         </Box>

        </Form>
    )
}

export default ChatInput