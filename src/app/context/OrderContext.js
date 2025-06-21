// src/context/OrderContext.js
'use client'

import { createContext, useState, useContext, useEffect } from 'react'
import { useAuth } from './AuthContext'

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const { user } = useAuth()
  const [order, setOrder] = useState({
    files: [],
    customerInfo: {
      name: user?.displayName || '',
      email: user?.email || ''
    },
    payment: {
      mode: null,
      amount: 0
    },
    status: 'draft'
  })

  // 1️⃣ Load order from sessionStorage on first mount
  useEffect(() => {
    const storedOrder = sessionStorage.getItem('orderSummary')
    if (storedOrder) {
      try {
        setOrder(JSON.parse(storedOrder))
      } catch (err) {
        console.error('Failed to parse stored order:', err)
      }
    }
  }, [])

  // 2️⃣ Sync order with Firebase user info
  useEffect(() => {
    if (user) {
      setOrder(prev => ({
        ...prev,
        customerInfo: {
          name: user.displayName || 'Guest',
          email: user.email
        }
      }))
    }
  }, [user])

  // 3️⃣ Save order to sessionStorage whenever it changes
  useEffect(() => {
    if (order) {
      sessionStorage.setItem('orderSummary', JSON.stringify(order))
    }
  }, [order])

  // ✅ Helpers
  const addFiles = (newFiles) => {
    setOrder(prev => ({
      ...prev,
      files: [...prev.files, ...newFiles]
    }))
  }

  const clearOrder = () => {
    const cleared = {
      files: [],
      customerInfo: {
        name: user?.displayName || '',
        email: user?.email || ''
      },
      payment: {
        mode: null,
        amount: 0
      },
      status: 'draft'
    }
    setOrder(cleared)
    sessionStorage.removeItem('orderSummary') // also clear storage
  }

  return (
    <OrderContext.Provider value={{ order, setOrder, addFiles, clearOrder }}>
      {children}
    </OrderContext.Provider>
  )
}

export const useOrder = () => {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}
