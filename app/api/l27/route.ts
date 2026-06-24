import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const subdomain = process.env.LAUNCH27_SUBDOMAIN;
  const apiKey = process.env.LAUNCH27_API_KEY;

  if (!subdomain || !apiKey) {
    console.warn("Launch27 API proxy: LAUNCH27_SUBDOMAIN or LAUNCH27_API_KEY environment variables are missing.");
    return NextResponse.json(
      { success: false, message: "Launch27 configuration is missing on the server." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { action, ...payload } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, message: "Missing action in request body." },
        { status: 400 }
      );
    }

    let endpoint = "";
    let apiPayload: Record<string, unknown> = {};

    const baseUrl = `https://${subdomain}.launch27.com/v1/`;

    if (action === "custom_fields") {
      const response = await fetch(`${baseUrl}booking/custom_fields`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Error fetching custom fields from Launch27 API.",
            details: data,
          },
          { status: response.status },
        );
      }

      return NextResponse.json({ success: true, data });
    }

    if (action === "services") {
      const response = await fetch(`${baseUrl}booking/services`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            message: data.message || "Error fetching services from Launch27 API.",
            details: data,
          },
          { status: response.status },
        );
      }

      return NextResponse.json({ success: true, data });
    }

    if (action === "spots") {
      endpoint = "booking/spots";
      apiPayload = {
        date: payload.date,
        days: payload.days || 42,
        mode: "new",
      };
    } else if (action === "estimate") {
      endpoint = "booking/estimate_price";
      apiPayload = {
        service_date: payload.service_date,
        frequency_id: parseInt(payload.frequency_id, 10),
        services: [
          {
            id: parseInt(payload.service_id || "213", 10),
            pricing_parameters: [
              {
                id: parseInt(payload.pricing_param_id || "86", 10),
                quantity: parseInt(payload.pricing_param_quantity, 10),
              },
            ],
            extras: payload.extras || [],
          },
        ],
      };
      if (payload.discount_code) {
        apiPayload.discount_code = payload.discount_code;
      }
    } else if (action === "booking") {
      endpoint = "booking";
      apiPayload = {
        user: {
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
        },
        address: payload.address,
        city: payload.city,
        zip: payload.zip,
        phone: payload.phone,
        frequency_id: parseInt(payload.frequency_id, 10),
        service_date: payload.service_date,
        arrival_window: parseInt(payload.arrival_window || "0", 10),
        services: [
          {
            id: parseInt(payload.service_id || "213", 10),
            pricing_parameters: [
              {
                id: parseInt(payload.pricing_param_id || "86", 10),
                quantity: parseInt(payload.pricing_param_quantity, 10),
              },
            ],
            extras: payload.extras || [],
          },
        ],
        payment_method: "stripe",
        stripe_token: payload.stripe_token,
      };
      if (payload.discount_code) {
        apiPayload.discount_code = payload.discount_code;
      }
      if (payload.welcome_deal === true) {
        apiPayload.welcome_deal = true;
      }
      if (Array.isArray(payload.custom_fields) && payload.custom_fields.length > 0) {
        apiPayload.custom_fields = payload.custom_fields;
      }
    } else {
      return NextResponse.json(
        { success: false, message: `Unsupported action: ${action}` },
        { status: 400 }
      );
    }

    console.log(`L27 Proxy Requesting: ${baseUrl}${endpoint} with payload:`, JSON.stringify(apiPayload));

    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(apiPayload),
    });

    const data = await response.json();
    const responseSummary = Array.isArray(data)
      ? {
          items: data.length,
          firstDate: data[0]?.date,
          lastDate: data[data.length - 1]?.date,
        }
      : { keys: Object.keys(data ?? {}).slice(0, 8) };

    console.log(`L27 Proxy Response (status ${response.status}):`, responseSummary);

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Error from Launch27 API.", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    console.error("L27 Proxy Exception:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
