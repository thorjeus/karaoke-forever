import PropTypes from 'prop-types'
import React, { Component } from 'react'
import RoomSelect from '../RoomSelect'
import UserImage from './UserImage'
import './AccountForm.css'

export default class AccountForm extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    showRoom: PropTypes.bool.isRequired,
    onSubmitClick: PropTypes.func.isRequired,
  }

  state = {
    isDirty: false,
    isChangingPassword: this.props.user.userId === null,
    userImage: undefined,
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.user.dateUpdated !== this.props.user.dateUpdated) {
      this.setState({ isDirty: false })
    }
  }

  render () {
    const isUser = this.props.user.userId !== null

    return (
      <form styleName='container'>
        <input type='email'
          autoComplete='off'
          autoFocus={!isUser}
          onChange={this.updateVisible}
          placeholder={isUser ? 'change username (optional)' : 'username or email'}
          ref={r => { this.username = r }}
          styleName='field'
        />

        <input type='password'
          autoComplete='new-password'
          onChange={this.updateVisible}
          placeholder={isUser ? 'change password (optional)' : 'password'}
          ref={r => { this.newPassword = r }}
          styleName='field'
        />

        {this.state.isChangingPassword &&
          <input type='password'
            autoComplete='new-password'
            placeholder={isUser ? 'new password confirm' : 'confirm password'}
            ref={r => { this.newPasswordConfirm = r }}
            styleName='field'
          />
        }

        <div styleName='userDisplayContainer' style={{ order: isUser ? -1 : 0 }}>
          <UserImage
            user={this.props.user}
            onSelect={this.handleUserImageChange}
          />
          <input type='text'
            defaultValue={isUser ? this.props.user.name : ''}
            onChange={this.updateVisible}
            placeholder='display name'
            ref={r => { this.name = r }}
            styleName='field name'
          />
        </div>

        {this.state.isDirty && isUser &&
          <>
            <br />
            <input type='password'
              autoComplete='current-password'
              placeholder='current password'
              ref={r => { this.curPassword = r }}
              styleName='field'
            />
          </>
        }

        {this.props.showRoom &&
          <RoomSelect
            onSelectRef={this.handleRoomSelectRef}
            onPasswordRef={this.handleRoomPasswordRef}
            styleName='field roomSelect'
          />
        }

        {(this.state.isDirty || !isUser) &&
          <button onClick={this.handleSubmit} className='primary'>
            {isUser ? 'Update Account' : 'Create Account'}
          </button>
        }
      </form>
    )
  }

  handleSubmit = (event) => {
    event.preventDefault()

    const data = new FormData()

    if (this.curPassword) {
      if (!this.curPassword.value) {
        alert('Please enter your current password to make changes')
        this.curPassword.focus()
        return
      }

      data.append('password', this.curPassword.value)
    }

    if (this.name.value.trim()) {
      data.append('name', this.name.value.trim())
    }

    if (this.username.value.trim()) {
      data.append('username', this.username.value.trim())
    }

    if (this.state.isChangingPassword) {
      data.append('newPassword', this.newPassword.value)
      data.append('newPasswordConfirm', this.newPasswordConfirm.value)
    }

    if (typeof this.state.userImage !== 'undefined') {
      data.append('image', this.state.userImage)
    }

    if (this.roomSelect) {
      if (!this.roomSelect.value) {
        alert('Please select a room')
        this.roomSelect.focus()
        return
      }

      data.append('roomId', this.roomSelect.value)

      if (this.roomPassword) {
        data.append('roomPassword', this.roomPassword.value)
      }
    }

    this.props.onSubmitClick(data)
  }

  handleUserImageChange = (blob) => {
    this.setState({
      userImage: blob,
      isDirty: true,
    })
  }

  handleRoomSelectRef = r => { this.roomSelect = r }
  handleRoomPasswordRef = r => { this.roomPassword = r }

  updateVisible = () => {
    if (this.props.user.userId === null) return

    this.setState({
      isDirty: !!this.username.value || !!this.newPassword.value ||
        this.name.value !== this.props.user.name,
      isChangingPassword: !!this.newPassword.value,
    })
  }
}
