import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'Authentication removed' })
}

export async function POST() {
  return NextResponse.json({ status: 'Authentication removed' })
}

