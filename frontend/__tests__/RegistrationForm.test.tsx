import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Register from '../src/pages/Register'
import { AuthProvider } from '../src/context/AuthContext'
import { describe, it, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router'

describe('Registration Form', () => {
  it('correctly renders all form fields', () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )
    expect(screen.getByRole('heading')).toBeInTheDocument()
    expect(screen.getByLabelText(/^username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^confirm password$/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('disables the sign up button when the user enters a username < 3 chars long', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/username/i), 'te')
    expect(screen.getByRole('button')).toBeInTheDocument()

    await waitFor(() => expect(screen.getByRole('button')).toBeDisabled())
  })

  it('shows an error message when the user enters a username < 3 chars long or > 20 chars long', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()
    await user.type(screen.getByLabelText(/username/i), 'te')
    await waitFor(() => expect(screen.getByText(/must be between/i)).toBeInTheDocument())

    await user.clear(screen.getByLabelText(/username/i))
    await user.type(screen.getByLabelText(/username/i), 'abcdefghijklmnopqrstuvwxyz')
    await waitFor(() => expect(screen.getByText(/must be between/i)).toBeInTheDocument())

    await user.clear(screen.getByLabelText(/username/i))
    await user.type(screen.getByLabelText(/username/i), 'username')
    await waitFor(() => expect(screen.queryByText(/must be between/i)).not.toBeInTheDocument())
  })

  it('does not show an error message when the user enters a valid username', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.clear(screen.getByLabelText(/username/i))
    await user.type(screen.getByLabelText(/username/i), 'username')
    await waitFor(() => expect(screen.queryByText(/must be between/i)).not.toBeInTheDocument())
  })

  it.each([
    ['username!', '!'],
    ['username?', '?'],
    ['username"', '"'],
    ['username£', '£'],
    ['username$', '$'],
    ['username%', '%'],
    ['username^', '^'],
    ['username&', '&'],
    ['username*', '*'],
    ['username(', '('],
    ['username)', ')'],
    ['username-', '-'],
    ['username+', '+'],
    ['username=', '='],
    ['username;', ';'],
    ['username:', ':'],
    ['username#', '#'],
    ["username'", "'"],
    ['username@', '@'],
    ['username~', '~'],
    ['username,', ','],
    ['username.', '.'],
    ['username<', '<'],
    ['username>', '>'],
    ['username/', '/'],
    ['username[[', '[['],
    ['username{{', '{{'],
    ['username]', ']'],
    ['username}', '}'],
    ['username\\', '\\'],
  ])('shows an error message when the user enters a username containing %s', async (invalidUsername) => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/username/i), invalidUsername)
    await waitFor(() => expect(screen.queryByText(/can only contain/i)).toBeInTheDocument())
  })

  it('shows an error message when password is less than 8 chars long', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), '123')
    await waitFor(() => expect(screen.getByText(/Must be at least 8 characters long/i)).toBeInTheDocument())
  })

  it('shows an error message when password does not contain an uppercase letter', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), 'passwords')
    await waitFor(() => expect(screen.getByText(/Must contain at least one uppercase letter/i)).toBeInTheDocument())
  })

  it('shows an error message when password does not contain a lowercase letter', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), 'PASSWORDS')
    await waitFor(() => expect(screen.getByText(/Must contain at least one lowercase letter/i)).toBeInTheDocument())
  })

  it('shows an error message when password does not contain a number', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), 'PASSWORDs')
    await waitFor(() => expect(screen.getByText(/Must contain at least one number/i)).toBeInTheDocument())
  })

  it('shows an error message when password does not contain a special character', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), 'PASSWORDs1')
    await waitFor(() => expect(screen.getByText(/Must contain at least one special character/i)).toBeInTheDocument())
  })

  it('does not show an error message when the user enters a valid password', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), 'PASSWORDs1!')
    await waitFor(() =>
      expect(screen.queryByText(/Must contain at least one special character/i)).not.toBeInTheDocument()
    )
  })

  it('shows an error when passwords do not match', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), 'PASSWORDs1!')
    await user.type(screen.getByLabelText(/^confirm password$/i), 'PASSWORDs!')
    await waitFor(() => expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument())
  })

  it('does not show an error when passwords match', async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Register />
        </BrowserRouter>
      </AuthProvider>
    )

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/^password$/i), 'PASSWORDs1!')
    await user.type(screen.getByLabelText(/^confirm password$/i), 'PASSWORDs1!')
    await waitFor(() => expect(screen.queryByText(/Passwords do not match/i)).not.toBeInTheDocument())
  })
})
