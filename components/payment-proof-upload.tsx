"use client"

import type React from "react"
import { useState } from "react"

interface PaymentProofUploadProps {
  onSuccess: () => void
}

const PaymentProofUpload: React.FC<PaymentProofUploadProps> = ({ onSuccess }) => {
  const [proofImage, setProofImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProofImage(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!proofImage) {
      alert("Please upload a payment proof image")
      return
    }

    setUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setUploading(false)
      setUploadSuccess(true)

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess()
      }, 1000)
    }, 2000)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Payment Proof"}
        </button>
      </form>
      {uploadSuccess && <p>Payment proof uploaded successfully!</p>}
    </div>
  )
}

export default PaymentProofUpload
