import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    const ZOHO_EMAIL = "contact@mrbedmed.com";
    const ZOHO_APP_PASSWORD = Deno.env.get("ZOHO_APP_PASSWORD");

    if (!ZOHO_APP_PASSWORD) {
      throw new Error("ZOHO_APP_PASSWORD not configured");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: ZOHO_EMAIL,
        pass: ZOHO_APP_PASSWORD,
      },
    });

    let subject = "";
    let html = "";

    if (type === "contact") {
      subject = `New Contact: ${data.subject}`;
      html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `;
    } else if (type === "order") {
      const itemsList = data.items
        .map(
          (item: { name: string; quantity: number; price: number }) =>
            `<li>${item.name} × ${item.quantity} — $${(item.price * item.quantity).toLocaleString()}</li>`
        )
        .join("");

      subject = `New Order from ${data.customer_name}`;
      html = `
        <h2>New Order Received</h2>
        <p><strong>Customer:</strong> ${data.customer_name}</p>
        <p><strong>Email:</strong> ${data.customer_email}</p>
        <p><strong>Phone:</strong> ${data.customer_phone || "N/A"}</p>
        <p><strong>Shipping:</strong> ${data.shipping_address}</p>
        <p><strong>Notes:</strong> ${data.notes || "None"}</p>
        <h3>Items:</h3>
        <ul>${itemsList}</ul>
        <p><strong>Total: $${data.total.toLocaleString()}</strong></p>
      `;
    } else {
      throw new Error("Invalid email type");
    }

    await transporter.sendMail({
      from: ZOHO_EMAIL,
      to: ZOHO_EMAIL,
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Email error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
