import {
    FlexColumn,
    FlexRow,
    FlexCenter,
    Heading,
    Tab,
    Tabs,
    TabsContainer,
    Input, 
    Checkbox,
    ButtonGroup,
    Button,
    Text,
    Textarea,
    FlipperPlugin,
    Link,
    ModalOverlay,
    Glyph,
    Popover,
    DetailSidebar,
    Panel,
    ManagedDataInspector,
    ManagedTable,
    TableRows,
    TableBodyRow,
    Select,
    styled
} from 'flipper';
import React from 'react';

type State = {
    selectedTab: string | null,
    selectedButton: string | null,
    showModal: boolean,
    showPopover: boolean,
    showSidebar: boolean
  };

const tableColumns = {
    title: {
      value: 'Title',
    },
    uri: {
      value: 'Uri',
    }
};

const tableColumnSizes = {
    title: 120,
    uri: 'flex'
}

export default class UiShowCase extends FlipperPlugin<State, any, any> {
    static TAB_NAME_FORM = 'Form'
    static TAB_NAME_DOCUMENT = 'Document'
    static TAB_NAME_FLEX_BOX = 'FlexBox'

    state = {
        selectedTab: null as string | null,
        selectedButton: null as string | null,
        showModal: false,
        showPopover: false,
        showSidebar: false
    } as State;

    static Space = styled('div')({
        height: '20px',
    });

    static FormRow = styled(FlexRow)({
        width: '100%',
        alignItems: 'center',
        height: 36,
        flexShrink: 0
    });

    static FormLabel = styled(Text)({
        width: 100
    });

    static TabContent = styled(FlexColumn)({
        height : 200,
        overflowY: 'auto'
    })

    

    render() {
        const tabs = [ UiShowCase.TAB_NAME_FORM, UiShowCase.TAB_NAME_DOCUMENT, UiShowCase.TAB_NAME_FLEX_BOX]
        

        return (
            <FlexColumn style={{height: '100%'}}>
                <FlexColumn style={ {backgroundColor: '#eeeeee', padding: 10}}>
                    Title
                </FlexColumn>
                <FlexColumn style={{padding: 10, height: "100%"}}>
                    <Heading>Tabs</Heading>
                    <TabsContainer>
                        <Tabs active={this.state.selectedTab} defaultActive={UiShowCase.TAB_NAME_FORM} 
                            onActive={this.onTabChanged}> 
                            {this.buildTabs(tabs)}
                        </Tabs>
                    </TabsContainer>
                    <UiShowCase.Space/>
                    <Heading>Actions</Heading>
                    <FlexRow>
                        <Button style={{marginRight: 8}} onClick={this.showModal.bind(this)}> Show ModalOverlay</Button>
                        <FlexColumn style={{marginRight: 8}}>
                            <Button onClick={this.showPopover.bind(this)}> Show Popupover</Button>
                            {this.buildPopover(this.state.showPopover)}
                        </FlexColumn>
                        <Button onClick={this.showSidebar.bind(this)}>Show Sidebar</Button>
                    </FlexRow>
                    <UiShowCase.Space/>
                    <Heading>Table</Heading>
                    <ManagedTable 
                      columns={tableColumns}
                      columnSizes={tableColumnSizes}
                      highlightableRows={true}
                      multiline={false}
                      multiHighlight={false}
                      onRowHighlighted={this.onRowSelected}
                      rows={this.buildTableRows()}
                      tableKey="rules"
                      />
                    {this.buildModal(this.state.showModal)}
                    {this.buildSidebar(this.state.showSidebar)}
                </FlexColumn>
                <FlexColumn style={ {backgroundColor: '#007acc', padding: 10, color: '#ffffff', marginTop: 'auto' }}>
                    Footer
                </FlexColumn>
            </FlexColumn>
        )
    }   

    onRowSelected = ( rows:Array<string>) => {
        alert( "selected row key: "+rows[0]);
    };

    buildTableRows() : TableRows {
        const rows =  [ 
            { title : 'daum' , uri : 'http://www.daum.net'},
            { title : 'google' , uri : 'http://www.google.com'},
            { title : 'naver' , uri : 'http://www.naver.com'},

        ];
        return rows.map( row => (this.buildSiteRow(row)));
    }

    buildSiteRow(site) {
        return {
            columns: {
                title: { value:  <Text>{site.title}</Text> },
                uri: { value: <Text>{site.uri}</Text> }
            },
            key: site.uri
        } as TableBodyRow;
    }

    showModal() {
        this.setState( {
            ...this.state,
            showModal: true
        });
    }

    closeModal() {
        this.setState( {
            ...this.state,
            showModal: false
        });
    }

    showPopover() {
        this.setState( {
            ...this.state,
            showPopover: true
        })
    }

    closePopover() {
        this.setState( {
            ...this.state,
            showPopover: false
        })   
    }

    buildModal(showModal: boolean) {
        if( showModal) {
            return (
                <ModalOverlay 
                    onClose={e => { this.closeModal();}}>
                    <FlexCenter style={{width:300, height: 300, backgroundColor: "#efefef"}}>
                        <FlexColumn>
                            <FlexRow>
                                <Glyph name="caution-triangle" color="#ff0000" style={{marginRight: 8}}/>
                                <Text>Modal!!!</Text>
                            </FlexRow>
                            <Button onClick={e => {this.closeModal();}}>Close</Button>
                        </FlexColumn>
                    </FlexCenter>
                </ModalOverlay>
            );
        } else {
            return null;
        }
    }

    buildPopover(showPopover: boolean) {
        if(showPopover) {
            return (
                <Popover onDismiss={e => {this.closePopover();}}>
                    <FlexRow style={{padding: 16}}>
                        <Glyph name="caution-triangle" color="#ff0000" style={{marginRight: 8}}/>
                        <Text>Popover!!!</Text>
                    </FlexRow>
                </Popover>
            );
        } else {
            return null;
        }
    }
    

    buildSidebar(showSidebar:boolean) {
        if(showSidebar) {
            return (
                <DetailSidebar width="350">
                    <FlexColumn>
                        <Button onClick={e=>{ this.closeSidebar();}}>Close</Button>
                        <Panel floating={false} heading={'State'} collapsable={false} collapsed={false}>
                            <ManagedDataInspector data={this.state} expandRoot={true} />
                        </Panel>
                    </FlexColumn>
                </DetailSidebar>
            );
        } else {
            return null;
        }
    }
    
    showSidebar() {
        this.setState( {
            ...this.state,
            showSidebar: true
        });   
    }

    closeSidebar() {
        this.setState( {
            ...this.state,
            showSidebar: false
        });   
    }

    onTabChanged = (newTab:string) => {
        this.setState( {
            ...this.state,
            selectedTab : newTab
        });
    };

    buildTabs(tabs: string[]) : Tab[] {
        return tabs.map(tabName =>  (
            <Tab label={tabName}>
                {this.buildTabContent(tabName)}
            </Tab>)
        );
    }

    buildTabContent(tabName: string) {
        if( tabName === UiShowCase.TAB_NAME_FORM) {
            return this.buildFormTab();
        } else if( tabName === UiShowCase.TAB_NAME_FLEX_BOX) {
            return this.buildFlexBoxTab();
        } else if( tabName === UiShowCase.TAB_NAME_DOCUMENT) {
            return this.buildDocumentTab();
        } else {
            return (<FlexColumn></FlexColumn>);
        }
    }

    buildFormTab() {
        return (
            <UiShowCase.TabContent>
                <UiShowCase.FormRow>
                    <UiShowCase.FormLabel>Text : </UiShowCase.FormLabel>
                    <Input placeholder="Please input something" 
                        value="" onChange={e => { console.log(e.target.value); }}/>
                </UiShowCase.FormRow>
                <UiShowCase.FormRow>
                    <UiShowCase.FormLabel>Checkbox : </UiShowCase.FormLabel>
                    <Checkbox
                     onChange={ checked => { console.log(checked);}}
                     checked={false} />
                </UiShowCase.FormRow>         
                <UiShowCase.FormRow>
                    <UiShowCase.FormLabel>Select : </UiShowCase.FormLabel>
                    <Select
                        options={{ item1: "Item1" , item2: "Item2" , item3: "Item3"}}
                      />
                </UiShowCase.FormRow>      
                <UiShowCase.FormRow>
                    <UiShowCase.FormLabel>ButtonGroup : </UiShowCase.FormLabel>
                    {this.buildButtonGroup()}
                </UiShowCase.FormRow>
                <UiShowCase.FormRow style={{height: 150, alignItems: 'flex-start'}}>
                    <UiShowCase.FormLabel>TextArea : </UiShowCase.FormLabel>
                    <Textarea 
                        value={"blah\nblah\nblah\nblah"}
                        onChange={e => { console.log(e.target.value); }}
                        style={{width: 200, height: '100%'}}
                    />
                </UiShowCase.FormRow>
            </UiShowCase.TabContent>
        );
    }

    buildButtonGroup() {
        const buttonIds = ['One', 'Two', 'Three'];
        const buttonIcons = ['info-circle', 'star', 'box'];
        const selectedButton = this.state.selectedButton;

        return (
            <ButtonGroup>
                {
                    buttonIds.map( (buttonId, idx) => (
                        <Button 
                            icon={buttonIcons[idx]}
                            onClick={this.onFormButtonClicked.bind(this, buttonId)}
                            selected={selectedButton === buttonId}
                        >{buttonId}</Button>  
                    ))
                }
            </ButtonGroup>
        )
    }

    buildFlexBoxTab() {
        return ( <UiShowCase.TabContent>
            <Heading>Flex Row</Heading>
            <FlexRow style={{backgroundColor: '#aaaaaa', padding: 8}}>
                <Text style={{backgroundColor: '#ff00ff'}}>Item</Text>
                <Text style={{backgroundColor: '#ffff00'}}>Item</Text>
                <Text style={{backgroundColor: '#00ffff'}}>Item</Text>
            </FlexRow>
            <Heading>Flex Column</Heading>
            <FlexColumn style={{backgroundColor: '#aaaaaa', padding: 8}}>
                <Text style={{backgroundColor: '#ff00ff'}}>Item</Text>
                <Text style={{backgroundColor: '#ffff00'}}>Item</Text>
                <Text style={{backgroundColor: '#00ffff'}}>Item</Text>
            </FlexColumn>
            <Heading>Flex Center</Heading>
            <FlexCenter style={{width: '100%', height: 80, flexShrink: 0, 
                backgroundColor: '#aaaaaa', padding: 8}}>
                <Text style={{backgroundColor: '#ffff00'}}>Item</Text>
            </FlexCenter>
        </UiShowCase.TabContent>);
    }   

    buildDocumentTab() {
        return ( <UiShowCase.TabContent>
            <Heading level="1">Heading lv1</Heading>
            <p>Haha Hoho</p>
            <Heading level="2">Heading lv2</Heading>
            <p>Haha Hoho</p>
            <p><Link href="http://www.daum.net">daum</Link> haha hoho</p>
        </UiShowCase.TabContent>);  
    }

    onFormButtonClicked(buttonId: String) {
        this.setState( {
            ...this.state,
            selectedButton : buttonId
        });
    }
}