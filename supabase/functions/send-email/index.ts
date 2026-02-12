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

    let adminSubject = "";
    let adminHtml = "";
    let customerEmail = "";
    let customerSubject = "";
    let customerHtml = "";

    if (type === "contact") {
      customerEmail = data.email;
      adminSubject = `New Contact: ${data.subject}`;
      adminHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `;
      customerSubject = `We received your message — Mr.BedMed`;
      customerHtml = `
        <h2>Thank you for contacting us, ${data.name}!</h2>
        <p>We've received your message regarding "<strong>${data.subject}</strong>" and will get back to you within 24 hours.</p>
        <p>Here's a copy of your message:</p>
        <blockquote style="border-left: 3px solid #0066cc; padding-left: 12px; color: #555;">${data.message.replace(/\n/g, "<br>")}</blockquote>
        <br>
        <p>Best regards,<br><strong>Mr.BedMed Team</strong><br>contact@mrbedmed.com</p>
      `;
    } else if (type === "order") {
      customerEmail = data.customer_email;
      const itemsList = data.items
        .map(
          (item: { name: string; quantity: number; price: number }) =>
            `<li>${item.name} × ${item.quantity} — $${(item.price * item.quantity).toLocaleString()}</li>`
        )
        .join("");

      adminSubject = `New Order from ${data.customer_name}`;
      adminHtml = `
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
      customerSubject = `Order Confirmation — Mr.BedMed`;
      customerHtml = `
        <h2>Thank you for your order, ${data.customer_name}!</h2>
        <p>We've received your order and will be in touch shortly with next steps.</p>
        <h3>Order Summary:</h3>
        <ul>${itemsList}</ul>
        <p><strong>Total: $${data.total.toLocaleString()}</strong></p>
        <p><strong>Shipping to:</strong> ${data.shipping_address}</p>
        ${data.notes ? `<p><strong>Notes:</strong> ${data.notes}</p>` : ""}
        <br>
        <p>If you have any questions, reply to this email or call us.</p>
        <p>Best regards,<br><strong>Mr.BedMed Team</strong><br>contact@mrbedmed.com</p>
      `;
    } else {
      throw new Error("Invalid email type");
    }

    // Send admin notification
    await transporter.sendMail({
      from: ZOHO_EMAIL,
      to: ZOHO_EMAIL,
      subject: adminSubject,
      html: adminHtml,
    });

    // Send customer confirmation
    if (customerEmail) {
      await transporter.sendMail({
        from: ZOHO_EMAIL,
        to: customerEmail,
        subject: customerSubject,
        html: customerHtml,
      });
    }

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
