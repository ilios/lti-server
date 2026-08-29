# Ilios LTI 1.3 Canvas JSON Reference

This document explains the fields in the Canvas Developer Key JSON and how each value is used in the LTI launch flow. For instructions on how to install the Ilios LTI 1.3 into Canvas, please see the the [installation documentation](Install.md).

## Full JSON

```json
{
  "title": "Ilios Dashboard",
  "description": "Display Ilios Calendar Information",
  "oidc_initiation_url": "https://lti.iliosproject.org/login",
  "target_link_uri": "https://lti.iliosproject.org/dashboard",
  "domain": "lti.iliosproject.org",
  "tool_id": "ilios-dashboard-prod",
  "public_jwk": {
    "e": "AQAB",
    "n": "vfgz4aS1N6cSWFlZMo5tGS2PVlwnTLbXKLTURGLbkPooi7-AJggkRzrJje2zacTpUX-lJdtoCH1gKMy2lgus1rH8N5XR64WWjig-9fXM6jj8SScZS4B_84wZ9FQMmbvylTwSJaMU2lGHxqn7dw73abVmTLY3laxatgscF_S1xY0XoavEloOpXC9XwTRbWEiaEcqc3NayO-fqdShB-Q2YOi4E1s8hCPdxvA3zoTEj5bybEKTRYzf-8diqOL4uHZcUD6h267o6k8orp87VEdINDGLoLs05MTb5ZxZ-hcp_qnUpg_P_gCclkzylLV3zymJcIXYtvZQGCQ23iG0mcowIGQ",
    "alg": "RS256",
    "kid": "a8ed9dc9-ae50-4544-99cf-fe0792d59bfc",
    "kty": "RSA",
    "use": "sig"
  },
  "extensions": [
    {
      "platform": "canvas.instructure.com",
      "domain": "lti.iliosproject.org",
      "tool_id": "ilios-dashboard-prod",
      "privacy_level": "public",
      "settings": {
        "text": "Ilios Dashboard",
        "placements": [
          {
            "placement": "course_navigation",
            "text": "Ilios Dashboard",
            "message_type": "LtiResourceLinkRequest",
            "target_link_uri": "https://lti.iliosproject.org/dashboard",
            "icon_url": "https://lti.iliosproject.org/icon.png",
            "default": "enabled",
            "visibility": "public",
            "windowTarget": "_blank"
          },
          {
            "placement": "account_navigation",
            "text": "Ilios Dashboard Admin",
            "message_type": "LtiResourceLinkRequest",
            "target_link_uri": "https://lti.iliosproject.org/dashboard",
            "icon_url": "https://lti.iliosproject.org/icon.png",
            "default": "enabled",
            "visibility": "admins",
            "windowTarget": "_blank"
          },
          {
            "placement": "user_navigation",
            "text": "Ilios Dashboard",
            "message_type": "LtiResourceLinkRequest",
            "target_link_uri": "https://lti.iliosproject.org/dashboard",
            "icon_url": "https://lti.iliosproject.org/icon.png",
            "default": "enabled",
            "visibility": "public",
            "windowTarget": "_blank"
          }
        ]
      }
    }
  ]
}
```

## Top-level fields

### `title`

The human-readable name of the tool in Canvas. This is what admins and instructors are most likely to see in the Developer Key UI and in app installation flows.

### `description`

Short description of what the tool does. This is informational and helps explain the purpose of the tool in the admin interface.

### `oidc_initiation_url`

The login initiation endpoint for LTI 1.3. Canvas starts the OIDC login flow by sending the user here first. In this setup, it maps to the Lambda-backed `/login` route.

### `target_link_uri`

The launch destination Canvas uses after login. In this setup, it maps to the `/dashboard` route, which is where the tool receives the final LTI launch.

### `domain`

The hostname Canvas should associate with the tool. This should be the host only, without `https://` and without any path.

### `tool_id`

An internal identifier for the tool. This is useful for distinguishing environments such as dev, test, and prod.

### `public_jwk`

The tool’s public JSON Web Key. Canvas uses this to validate signatures related to the tool when needed. The important parts are:

* `kty`: key type, here `RSA`
* `n`: the RSA modulus
* `e`: the exponent, usually `AQAB`
* `alg`: signing algorithm, here `RS256`
* `use`: intended purpose, here `sig`
* `kid`: key ID used to identify the matching public key

## Extension block

### `extensions`

Canvas uses the `extensions` array to describe the tool configuration for the platform.

#### `platform`

The platform identifier for Canvas. This tells Canvas which platform-specific settings apply.

#### `domain`

The tool’s hostname again, used inside the Canvas extension block.

#### `tool_id`

A stable internal identifier for this tool instance.

#### `privacy_level`

Controls how much user data the tool can receive. `public` is the broadest option and is commonly used when the tool needs standard launch claims.

#### `settings`

This block holds Canvas-specific placement settings.

##### `text`

The fallback label for the tool. If a placement does not override its own `text`, Canvas can use this label in the UI.

##### `placements`

An array of places where the tool should appear in Canvas.

## Placement fields

### `placement`

Where the tool appears in Canvas.

* `course_navigation` places the tool in the left-hand navigation for a course.
* `account_navigation` places the tool in the account-level navigation. This is the best match for an admin context.
* `user_navigation` places the tool in the global user menu.

### `text`

The label shown to users for that placement.

### `message_type`

The LTI message type used for the launch.

* `LtiResourceLinkRequest` means a standard resource launch.

### `target_link_uri`

The URL Canvas should use when launching the tool from that placement. In this configuration, it points to `/dashboard`.

### `icon_url`

The optional icon Canvas can show for the placement. If the image URL is not available, this can be removed without affecting the launch.

### `default`

Whether the placement is enabled by default.

* `enabled` means Canvas should expose it by default.
* `disabled` means it is not shown by default.

### `visibility`

Controls who can see the placement.

* `public` means anyone who can access the relevant Canvas context can see it.
* `admins` means only account-level admin roles can see it.

### `windowTarget`

A best-effort hint that the tool should open in a new window or tab.

* `_blank` attempts to open the launch in a new tab or window.
* Canvas may not honor this uniformly in every placement.

## Placement mapping

### `course_navigation`

This adds Ilios to the course sidebar so users can launch the tool from inside a course.

### `account_navigation`

This adds Ilios to the account-level navigation for admins. This is the placement to use when you want an admin-facing context.

### `user_navigation`

This adds Ilios to the user/global menu so it can be accessed outside a specific course context.

## Practical notes

* Keep `oidc_initiation_url` pointed at `/login`.
* Keep `target_link_uri` pointed at `/dashboard`.
* Keep `domain` as the host only.
* Keep `tool_id` stable for each environment.
* Remove `icon_url` if you do not have a real icon image to serve.
* `windowTarget` is helpful, but the app should still be able to function if Canvas opens it in an iframe.

## Suggested usage pattern

For a dev environment:

* `title` should clearly identify the environment.
* `tool_id` should remain unique and stable.
* `course_navigation` is the main placement for course users.
* `account_navigation` is the best placement for admin-only access.
* `user_navigation` is optional if you want a global shortcut.

## Summary

This JSON is a Canvas Developer Key configuration for an LTI 1.3 tool. The top-level fields describe the tool, the `public_jwk` publishes the tool’s public key, and the `extensions` block tells Canvas where to place the tool and how to launch it.


