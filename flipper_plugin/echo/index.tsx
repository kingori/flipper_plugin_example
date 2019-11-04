import {
    FlexBox,
    FlexColumn,
    FlexRow,
    Text,
    Heading,
    Input,
    FlipperPlugin,
    Button,
    styled
} from 'flipper';
import React from 'react';

type State = {
    msg: string | null,
}

type PersistedState = {
    responses: Array<String> 
  };

export default class Echo extends FlipperPlugin<State, any, PersistedState> {
    static defaultPersistedState: PersistedState = {
        responses: []
    };
    
    state: State = {
        msg: null as string | null
    }

    static Space = styled('div')({
        height: '20px',
        flexShrink: 0
    })

    static persistedStateReducer = (
        persistedState: PersistedState,
        method: string,
        payload: Object,
      ) => {
          switch(method) {
            case `message`:
                return {
                    ...persistedState,
                    responses: [...persistedState.responses, payload.time +":"+payload.msg ]
                } 
            default: 
                return persistedState;
          }
    }

    init() {
        //이 경우 위 persistedStateReducer 와 중복됨
        // this.client.subscribe("message", (echo:Object)=> {
        //     this.appendResponse( echo.time +":"+ echo.msg);
        // });
    }

    appendResponse( resp: string) {
        this.props.setPersistedState(
            {...this.props.persistedState,
            responses: [...this.props.persistedState.responses, resp ]
            });
    }

    render() {
        return (
            <FlexColumn style={{padding: 8, height: '100%'}}>
                <Heading>Echo</Heading>
                <FlexRow style={{alignItems: 'center'}}>
                    <Text>Message: </Text>
                    <Input placeholder="Input message to send" value={ this.state.msg} onChange={e => {this.updateMsg(e.target.value );}}/>
                </FlexRow>
                <Echo.Space/>
                <Button style={{width: 120}} onClick={ e=> {this.sendMessage();}}>Send</Button>
                <Echo.Space/>
                <Heading>Responses</Heading>
                <Echo.Space/>
                <FlexBox style={{height: '100%' ,width: '100%', backgroundColor: '#000000', color: '#eeeeee', flexShrink: 0}}>
                    {this.renderResponses()}
                </FlexBox>
            </FlexColumn>
        )
    }   

    renderResponses() {
        const responses = this.props.persistedState.responses;

        return (
            <pre>
                {
                    responses.reduce( (acc, curVal) => {return acc + curVal +'\n'; } , '')
                }
            </pre>
        )
    }

    updateMsg( msg : string) {
        this.setState( {
            ...this.state, 
            msg: msg
        });
    }

    sendMessage() {
        this.client
            .call('echo', {msg : this.state.msg })
            .then((params) => {
                this.appendResponse("Success:"+params.resp);
            })
            .catch((err) => {
                this.appendResponse("Error:"+err.resp);
            });
    }
}