/* @flow */

import React, { Component } from 'react'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { View,Text,FlatList,StyleSheet } from 'react-native'
import { Container ,Content ,Header, Item, Input, Icon, Button } from 'native-base'
import Modal from 'react-native-modalbox'
import PracticeModal from './PracticeModal'
import InfoBar from './InfoBar'
import styled from 'styled-components/native'
import color from '../../components/colors'
import TopHeader  from '../../components/header'
import ThumbnailListItem from '../../components/metaList/item'

@inject('bankStore','questionStore','userStore')
@observer
export default class PracticeIndex extends Component {
  @observable modalState = {
      isOpen: true,
      isDisabled: false,
      swipeToClose: true,
      sliderValue: 0.3
  }

  @observable onEndReachedCalledDuringMomentum = true

  componentWillMount(){
    this.asyncInitialData()
  }

  asyncInitialData = () => {
    const { bankStore, userStore} = this.props
    bankStore.cleanUserBanks()
    bankStore.fetchRecords(userStore.id)
    bankStore.fetchByUser(userStore.id)
  }

  componentDidMount(){
    this.refs.modal1.close()
  }

  onClose() {
  }

  onOpen() {
  }

  onClosingState(state) {
  }

  _handleItemPress = (item,index) => {
    const {bankStore} = this.props
    const {setCurrentIndex } = bankStore
    setCurrentIndex(index)
    this.refs.modal1.open()
  }

  _onRefresh = () => {
    this.asyncInitialData()
  }

  _keyExtractor = (item, index) =>  index

  render() {
    const {navigation, bankStore,userStore} = this.props
    const { banksTotal } = bankStore
    let total = 0
    if ( banksTotal !== -1 ) total = banksTotal
    return (
      <Container style={{backgroundColor:color.background}}>
          <TopHeader
            navigation={navigation}
            title={ <Text style={{color:'white', fontSize:20 }}>练习</Text>}
            style={{ backgroundColor:color.theme }}
            />
            <InfoBar navigation={navigation}/>
            <DesTextView>
              <Text style={{color:'#cccccc'}}> {total}个题库 </Text>
            </DesTextView>
            <FlatList
              data={bankStore.banks}
              keyExtractor={this._keyExtractor}
              renderItem={({item,index}) => <ThumbnailListItem  item={item}
                                                          index={ index }
                                                          key={item.key}
                                                          onPress={this._handleItemPress}/>}
              refreshing={bankStore.loading}
              onRefresh={()=>this._onRefresh()}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
              onEndReached={({ distanceFromEnd }) => {
                if (!this.onEndReachedCalledDuringMomentum) {
                  bankStore.fetchByUser(userStore.id)
                  this.onEndReachedCalledDuringMomentum = true
                }

               }}
              style={{margin:10}}
              />

          <Modal
              style={[styles.modal]}
              ref={"modal1"}
              swipeToClose={this.swipeToClose}
              onClosed={this.onClose}
              onOpened={this.onOpen}
              onClosingState={this.onClosingState}>
                <PracticeModal navigation={navigation} />
            </Modal>
      </Container>
    )
  }
}

const DesTextView = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  height:20;
  margin-right:20;
`

const styles = StyleSheet.create({

  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    height:400,
    width:300,
    backgroundColor:'transparent'
  },

});
