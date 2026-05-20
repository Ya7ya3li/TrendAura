import { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { supabase } from '../config/supabase'

export default function Success() {

  const navigate = useNavigate()

  const [loading, setLoading] =
  useState(true)

  const [message, setMessage] =
  useState('جاري التحقق من الدفع...')

  useEffect(() => {

    verifyPayment()

  }, [])

  const verifyPayment = async () => {

    try {

      // =====================
      // Get URL Params
      // =====================

      const params =
      new URLSearchParams(
        window.location.search
      )

      const paymentId =
      params.get('id')

      const planType =
      params.get('plan')

      if (!paymentId) {

        setMessage(
          'معرف العملية غير موجود'
        )

        return

      }

      // =====================
      // Get Current User
      // =====================

      const { data: userData } =
      await supabase.auth.getUser()

      const userId =
      userData?.user?.id

      if (!userId) {

        setMessage(
          'يجب تسجيل الدخول أولاً'
        )

        return

      }

      // =====================
      // Verify Payment
      // =====================

      const response =
      await fetch(

        `${import.meta.env.VITE_API_URL}/api/payment/verify`,

        {

          method: 'POST',

          headers: {
            'Content-Type':
            'application/json'
          },

          body: JSON.stringify({

            paymentId,

            userId,

            planType

          })

        }

      )

      const data =
      await response.json()

      if (data.success) {

        setMessage(
          'تم تفعيل اشتراكك بنجاح 🚀'
        )

      } else {

        setMessage(
          data.message ||
          'فشل التحقق من الدفع'
        )

      }

    } catch (error) {

      console.error(error)

      setMessage(
        'حدث خطأ أثناء التحقق'
      )

    } finally {

      setLoading(false)

      setTimeout(() => {

        navigate('/')

      }, 4000)

    }

  }

  return (

    <div className="login-page">

      <div
        className="login-card"
        style={{
          textAlign: 'center'
        }}
      >

        <div
          style={{
            fontSize: '80px',
            marginBottom: '20px'
          }}
        >
          🎉
        </div>

        <h1
          style={{
            color: '#10b981',
            marginBottom: '16px'
          }}
        >

          {
            loading
              ? 'جاري التحقق...'
              : 'نجحت العملية'
          }

        </h1>

        <p
          style={{
            color: '#64748b'
          }}
        >

          {message}

        </p>

      </div>

    </div>

  )

}