# -*- coding: utf-8 -*-
# Copyright (c) 2020, Frappe and contributors
# For license information, please see license.txt

from __future__ import unicode_literals

import frappe
from frappe.model.document import Document
from press.api.billing import get_stripe


class StripePaymentMethod(Document):
	def set_default(self):
		stripe = get_stripe()
		# set default payment method on stripe
		stripe.Customer.modify(
			self.stripe_customer_id,
			invoice_settings={"default_payment_method": self.stripe_payment_method_id},
		)
		frappe.db.update(
			"Stripe Payment Method",
			{"team": self.team, "name": ("!=", self.name)},
			"is_default",
			0,
		)
		self.is_default = 1
		self.save()
		frappe.db.set_value("Team", self.team, "default_payment_method", self.name)