package com.sn.dtai.admingateway.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.sn.dtai.admingateway.domain.PostesReferenceActes} entity.
 */
public class PostesReferenceActesDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private Long postes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostes() {
        return postes;
    }

    public void setPostes(Long postes) {
        this.postes = postes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PostesReferenceActesDTO)) {
            return false;
        }

        PostesReferenceActesDTO postesReferenceActesDTO = (PostesReferenceActesDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, postesReferenceActesDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PostesReferenceActesDTO{" +
            "id=" + getId() +
            ", postes=" + getPostes() +
            "}";
    }
}
